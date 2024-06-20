import { ChangeEvent, useEffect, useState } from 'react';
import { algorithmData } from './Input';
import {Process, QueuesPlus, OutputData} from '../App';
import {Id, toast} from 'react-toastify';

interface ProcessesInputProps {
    algorithmData: algorithmData;
    setInputDataFct: (data: OutputData) => void;
    setDisplayProcessesInput: (bool: boolean) => void;
}

const ProcessesInput: React.FC<ProcessesInputProps> = ({
    algorithmData,
    setInputDataFct,
    setDisplayProcessesInput }) => {

    // states
    const [toastId, setToastId] = useState<Id>(Number.MIN_VALUE);
    const [title, setTitle] = useState<string>('');
    const [processesData, setProcessesData] = useState<Process[]>([]);
    const [displayInputs, setDisplayInputs] = useState<boolean>(false);
    const [queues, setQueues] = useState<QueuesPlus[]>([]);


    const goBack = () => {setDisplayProcessesInput(false)}

    const handleArrivalTimeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(e.target.id, 10);
        const value = parseInt(e.target.value, 10);
        let updatedProcesses = [...processesData];


        if(Number.isNaN(value))   updatedProcesses[id].arrivalTime = undefined;
        else   updatedProcesses[id].arrivalTime = parseInt(e.target.value, 10);
        setProcessesData([...updatedProcesses]);
    }


    const handleBurstTimeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(e.target.id, 10);
        const value = parseInt(e.target.value, 10);
        let updatedProcesses = [...processesData];


        if(Number.isNaN(value))   updatedProcesses[id].burstTime = undefined;
        else   updatedProcesses[id].burstTime = parseInt(e.target.value, 10);
        setProcessesData([...updatedProcesses]);
    }


    const handlePriorityOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(e.target.id, 10);
        let updatedProcesses = [...processesData];

        updatedProcesses[id].priority = parseInt(e.target.value, 10);
        setProcessesData([...updatedProcesses]);
    }


    const handleQueueTypeOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        const index = parseInt(e.target.id, 10);
        const updatedQueue = [...queues];

        if(type === 'RR')   updatedQueue[index].quantumTime = 0;
        else  updatedQueue[index].quantumTime = undefined;
        updatedQueue[index].queueType = (type as 'FCFS' | 'SJF' | 'RR');

        setQueues(updatedQueue);
    }


    const handleProcessQueueLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const level = parseInt(e.target.value, 10);
        const index = parseInt(e.target.id, 10);
        let updatedProcesses = [...processesData];

        // level - 1 because in the Process class the queue level start from 0 not 1
        updatedProcesses[index].queueLevel = level - 1;
        updatedProcesses[index].queueType = queues[level - 1].queueType;
        setProcessesData([...updatedProcesses]);
    }


    const handleSetQueueQuantum = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const quantum = parseInt(e.target.value, 10);
        const updatedQueues = [...queues];

        // if the quantum still empty => error
        if(!Number.isNaN(quantum))  updatedQueues[index].quantumTime = quantum;
        else    updatedQueues[index].quantumTime = 0; // at the end when the quantum is 0
        // show message quantum time cannot be empty

        setQueues([...updatedQueues]);
    }


    const checkDataValidity = (): string => {
        for(let i = 0; i < processesData.length; i++) {
            if(processesData[i].arrivalTime === undefined)
                return 'Process arrival time cannot be empty';
            if(processesData[i].burstTime === undefined)
                return 'Process burst time cannot be empty';
            if((processesData[i].arrivalTime as number) >= 1000)
                return 'Process arrival time must be lower than 1000';
            if((processesData[i].burstTime as number) >= 1000)
                return 'Process burst time must be lower than 1000';
            if((processesData[i].arrivalTime as number) < 0)
                    return 'Process arrival time cannot be lower than 0';
            if((processesData[i].burstTime as number) <= 0)
                    return 'Process burst time must be greater than 0';
            if(title.startsWith('Priority')) {
                if((processesData[i].priority === undefined) || (
                    processesData[i]).priority as number < 0)
                        return 'Process priority cannot be lower than 0';
                if(processesData[i].priority as number >= 1000)
                    return 'Process priority must be lower than 1000';
            }
        }

        if(title.includes('Multy Level')) {
            for(let i = 0; i < queues.length; i++) {
                if((queues[i].queueType === 'RR')) {
                    if(queues[i].quantumTime as number <= 0)
                        return 'Round Robin queue quantum time must be greater than 0';
                    if(queues[i].quantumTime as number > 1000)
                        return 'Round Robin queue quantum time must be lower than 1000';
                }
            }
        }

        return '';
    }


    const handleCalculation = () => {
        const msg = checkDataValidity();
        if(msg !== '') {
            if(toastId !== Number.MIN_VALUE)    toast.dismiss(toastId);
            setToastId(toast.error(msg));

            return;
        }


        let data: OutputData = {
                algorithmData: {...algorithmData},
                processes: [...processesData],
                queues: (queues.length !== 0) ? {...queues}: []
            }

        setInputDataFct(data);
    }


    useEffect(() => {
        setDisplayInputs(false);
        const algorithmType = algorithmData.algorithmType;
        setTitle(algorithmType);


        let processes:Process[] = [];
        for(let i = 0; i < algorithmData.nbOfProcesses; i++) {
            processes.push({
                id: i, // id used for index access to a specific process
                arrivalTime: undefined,
                burstTime: undefined,
                completionTime: 0,
                turnAroundTime: 0,
                waitingTime: 0
            })

            if(algorithmType.includes('Priority'))   processes[i].priority = -1;
            else if(algorithmType.includes('Multy Level')) {
                processes[i].queueType = 'FCFS'; // default queue type
                processes[i].queueLevel = 0; // default queue level
            }

            setProcessesData(processes);
        }

        if(algorithmType.includes('Multy Level')) {
            let fillQueue: QueuesPlus[] = [];
            for(let i = 0; i < (algorithmData.nbOfQueues as number); i++)
                fillQueue.push({queueType: 'FCFS', quantumTime: undefined, queueLevel: i})

            setQueues([...fillQueue]);
        }

        setDisplayInputs(true);
    }, [algorithmData])




    return (
        <>
            {(Object.keys(algorithmData).length !== 0) &&
                <div className='processes-input'>
                    <p className='title'>{title}</p>
                    {displayInputs && title.includes('Multy Level') &&
                        Array.from({ length: algorithmData.nbOfQueues as number }, (_, i) => (
                            <div key={i} className='queue-inputs'>
                                <p>Queue: {i + 1}</p>
                                <select id={i.toString()} onChange={handleQueueTypeOnChange}>
                                    <option value='FCFS'>FCFS</option>
                                    <option value='SJF'>SJF</option>
                                    <option value='RR'>RR</option>
                                </select>
                                {queues[i].quantumTime !== undefined && 
                                <input
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                        handleSetQueueQuantum(e, i)}
                                    type='number'
                                    placeholder='quantum' />
                                }
                            </div>
                        ))
                    }

                    {displayInputs && Array.from({ length: algorithmData.nbOfProcesses }, (_, i) => (
                        <div key={i} className='process-input'>
                            <span className='span-process'>process{i + 1}: </span>
                            <input
                                type='number'
                                id={i.toString()}
                                onChange={handleArrivalTimeOnChange}
                                placeholder='arrival time' />
                            <input
                                type='number'
                                id={i.toString()}
                                onChange={handleBurstTimeOnChange}
                                placeholder='burst time'/>

                            {algorithmData.algorithmType.startsWith('Priority') &&
                                <input
                                    type='number'
                                    id={i.toString()}
                                    onChange={handlePriorityOnChange}
                                    placeholder='priority'/>
                            }

                            {algorithmData.algorithmType.includes('Multy Level') &&
                                <>
                                    <p>queue level</p>
                                    <select
                                        id={i.toString()}
                                        className='selectedQueue'
                                        onChange={handleProcessQueueLevelChange}>
                                        {displayInputs && 
                                            algorithmData.algorithmType.includes('Multy Level') &&
                                            Array.from({ length: algorithmData.nbOfQueues as number },
                                                (_, j) => (
                                                    <option 
                                                        key={j + 1} 
                                                        value={j + 1}>{j + 1}
                                                    </option>)
                                            )}
                                    </select>
                                </>
                            }
                        </div>
                    ))}

                    <div className="step2-inputs-buttons">
                    <button
                        onClick={goBack}
                        className="input-back-btn">Back</button>
                    <button
                        onClick={handleCalculation}
                        className='calculate-btn'>Calculate</button>
                    </div>
                </div>
            }
        </>
    )
}

export default ProcessesInput;
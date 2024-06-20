import React, { useState} from 'react'
import { algorithmData } from './Input';
import {Id, toast} from 'react-toastify';


interface AlgorithmInputProps {
    setDisplayProcessesInput: (bool: boolean) => void;
    setAlgorithmInputData: (data: algorithmData) => void;
}

const AlgorithmInput: React.FC<AlgorithmInputProps> = ({ 
    setDisplayProcessesInput, 
    setAlgorithmInputData }) => {

    // states
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('First Come First Serves(FCFS)');
    const [toastId, setToastId] = useState<Id>(Number.MIN_VALUE);
    const [nbOfProcesses, setNbOfProcesses] = useState<number | undefined>(undefined);
    const [roundRobin, setRoundRobin] = useState<boolean>(false);
    const [quantumTime, setQuantumTime] = useState<number | undefined>(undefined);
    const [multyLevelAlgo, setMultyLevelAlgo] = useState<boolean>(false);
    const [nbOfQueues, setNbOfQueues] = useState<number | undefined>(undefined);

    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const algo = e.target.value;
        setRoundRobin(false);
        setMultyLevelAlgo(false);
        setQuantumTime(undefined);
        setNbOfQueues(undefined);

        setSelectedAlgorithm(algo);
        if(algo.includes('RR'))    setRoundRobin(true);
        else if(algo.startsWith('Priority')) {
            if(toastId !== Number.MIN_VALUE)    toast.dismiss(toastId);
            setToastId(toast.info('priority for each process will be filled in the next step'));
        }
        else if(algo.includes('Multy Level')) {
            setMultyLevelAlgo(true);

            if(toastId !== Number.MIN_VALUE)    toast.dismiss(toastId);
            setToastId(toast.info('each queue type will be filled in the next step'));
        }
    }


    const handleNbOfProcessesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNbOfProcesses(parseInt(e.target.value, 10));
    }

    const handleQuantumTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantumTime(parseInt(e.target.value, 10));
    }

    const handleNbOfQueuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNbOfQueues(parseInt(e.target.value, 10));
    }


    const checkInputValidity = (): string => {
        if((nbOfProcesses === undefined) || (Number.isNaN(nbOfProcesses)))
            return 'Number of processes cannot be empty';
        if(nbOfProcesses <= 0)
            return 'Number of processes cannot be lower than or equal 0';
        if(nbOfProcesses > 500)
            return 'Maximum Number of processes is 500';
        if(roundRobin && ((quantumTime === undefined) || (Number.isNaN(quantumTime))))
            return 'Quantum time cannot be empty';
        if(roundRobin && ((quantumTime as number) <= 0))
            return 'Quantum time cannot be lower than or equal 0';
        if(roundRobin && ((quantumTime as number) > 100))
            return 'Maximum quantum time is 100';
        if(multyLevelAlgo && ((nbOfQueues === undefined) || (Number.isNaN(nbOfQueues))))
            return 'Number of queues cannot be empty';
        if(multyLevelAlgo && ((nbOfQueues as number) <= 1))
            return 'Number of queues cannot be lower than or equal 1';
        if(multyLevelAlgo && ((nbOfQueues as number) > 40))
            return 'Maximum number of Queues is 40';

        return '';
    }


    const handleNextStep = () => {
        const msg: string = checkInputValidity();

        if(msg.length !== 0) {
            setDisplayProcessesInput(false);

            if(toastId !== Number.MIN_VALUE)    toast.dismiss(toastId);
            setToastId(toast.error(msg));
            return;
        }


        if((selectedAlgorithm.includes('FCFS')) || (
            selectedAlgorithm.includes('SJF')) || (
            selectedAlgorithm.includes('SRTF')) || (
            selectedAlgorithm.startsWith('Priority')
            )) {
                setAlgorithmInputData({
                    algorithmType: selectedAlgorithm,
                    nbOfProcesses: nbOfProcesses as number
                })
        }
        else if(selectedAlgorithm.includes('RR')) {
            setAlgorithmInputData({
                algorithmType: selectedAlgorithm,
                nbOfProcesses: nbOfProcesses as number,
                quantumTime: quantumTime as number
            })
        }
        else {
            setAlgorithmInputData({
                algorithmType: selectedAlgorithm,
                nbOfProcesses: nbOfProcesses as number,
                nbOfQueues: nbOfQueues as number
            })
        }

        setDisplayProcessesInput(true);
    }


    const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter')   return;
        handleNextStep();
    }



    return (
        <div className='algorithm-input'>
            <p className='input-title'>Input</p>
            <div className='input-fields'>
                <select className='algorithms' onChange={handleSelectChange} >
                    <option 
                        value='First Come First Serves(FCFS)' 
                        className='option'>First Come First Serves(FCFS)</option>
                    <option 
                        value='Shortest Job First(SJF)' 
                        className='option'>Shortest Job First(SJF)</option>
                    <option 
                        value='Round Robin(RR)' 
                        className='option'>Round Robin(RR)</option>
                    <option 
                        value='Priority Non-Preemtive' 
                        className='option'>Priority Non-Preemtive</option>
                    <option 
                        value='Priority Preemtive' 
                        className='option'>Priority Preemtive</option>
                    <option 
                        value='Shortest Remaining Time First(SRTF)' 
                        className='option'>Shortest Remaining Time First(SRTF)</option>
                    <option 
                        value='Multy Level Queue(MLQ)' 
                        className='option'>Multy Level Queue(MLQ)</option>
                    <option 
                        value='Multy Level Feedback Queue(MLFQ)' 
                        className='option'>Multy Level Feedback Queue(MLFQ)</option>
                </select>
                <input 
                    type='number'
                    onKeyDown={handlePressKey}
                    onChange={handleNbOfProcessesChange}
                    placeholder='enter the number of processes' 
                    className='nb-of-processes' />

                {roundRobin && 
                    <input 
                        type='number'
                        onKeyDown={handlePressKey}
                        onChange={handleQuantumTimeChange}
                        placeholder='quantum time' 
                        className='quantum-time' />
                }
                {multyLevelAlgo && 
                    <input 
                        type='number'
                        onKeyDown={handlePressKey}
                        onChange={handleNbOfQueuesChange}
                        placeholder='number of queues' 
                        className='nb-of-queues' />
                }

                <button
                    onClick={handleNextStep}
                    className='next-btn'>next</button>
            </div>
        </div>
    )
}

export default AlgorithmInput
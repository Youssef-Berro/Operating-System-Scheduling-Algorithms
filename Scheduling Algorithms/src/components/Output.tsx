import React, { useEffect, useState } from 'react'
import { OutputData } from '../App'
import FCFS from '../classes/FCFS';
import SJF from '../classes/SJF';
import RR from '../classes/RR';
import PriorityNonPre from '../classes/PriorityNonPre';
import PriorityPre from '../classes/PriorityPre';
import SRTF from '../classes/SRTF';
import { MLQ } from '../classes/MLQ';
import { MLFQ } from '../classes/MLFQ';
import Process from '../classes/Process';
import './../css/Output.css';
import { useNavigate } from 'react-router-dom';
import { GantData } from '../classes/Algorithm';

interface OutputProps {
    inputData: OutputData
}

const Output: React.FC<OutputProps> = ({inputData}) => {
    const navigate = useNavigate();

    // states
    const [ready, setReady] = useState<boolean>(false);
    const [gantDiagram, setGantDiagram] = useState<GantData[]>([]);
    const [avrgWT, setAvrgWT] = useState<number>(0);
    const [avrgTAT, setAvrgTAT] = useState<number>(0);
    const [algorithm, setAlgorithm] = useState<FCFS | SJF | RR | 
                                                PriorityNonPre | 
                                                PriorityPre | SRTF | 
                                                MLQ | MLFQ>();


    // navigate(-1) => go to previous page
    const goBack = () => {navigate(-1)}

    const createAlgorithm = () => {
        const algorithmType = inputData.algorithmData.algorithmType;

        if(algorithmType.includes('FCFS')) 
            setAlgorithm(new FCFS);
        else if(algorithmType.includes('SJF'))
            setAlgorithm(new SJF());
        else if(algorithmType.includes('RR'))
            setAlgorithm(new RR(inputData.algorithmData.quantumTime as number));
        else if(algorithmType.includes('SRTF'))
            setAlgorithm(new SRTF());
        else if(algorithmType.includes('Non-Preemtive'))
            setAlgorithm(new PriorityNonPre());
        else if(algorithmType.includes('Preemtive'))
            setAlgorithm(new PriorityPre());
        else if(algorithmType.includes('MLQ'))
            setAlgorithm(new MLQ(inputData.algorithmData.nbOfQueues as number, inputData.queues));
        else if(algorithmType.includes('MLFQ'))
            setAlgorithm(new MLFQ(inputData.algorithmData.nbOfQueues as number, inputData.queues));
    }


    useEffect(() => {
        if(algorithm) {
            const algorithmType = inputData.algorithmData.algorithmType;

            if((algorithmType.includes('FCFS')) || (algorithmType.includes('SJF')) || (
                algorithmType.includes('RR')) || (algorithmType.includes('SRTF'))) {
                    for(let i = 0; i < inputData.processes.length; i++) {
                        const arrivalTime = inputData.processes[i].arrivalTime;
                        const burstTime = inputData.processes[i].burstTime;

                        algorithm?.addProcess(new Process(
                                        arrivalTime as number,
                                        burstTime as number
                                ))
                    }
            }
            else if(algorithmType.includes('Priority')) {
                for(let i = 0; i < inputData.processes.length; i++) {
                    const arrivalTime = inputData.processes[i].arrivalTime;
                    const burstTime = inputData.processes[i].burstTime;
                    const priority = inputData.processes[i].priority;

                    algorithm?.addProcess(new Process(
                                    arrivalTime as number,
                                    burstTime as number,
                                    priority
                        ))
                }
            }
            else if(algorithmType.includes('Multy Level')) {
                for(let i = 0; i < inputData.processes.length; i++) {
                    const arrivalTime = inputData.processes[i].arrivalTime;
                    const burstTime = inputData.processes[i].burstTime;
                    const queueLevel = inputData.processes[i].queueLevel;
                    const queueType = inputData.processes[i].queueType;

                    algorithm?.addProcess(new Process(
                                    arrivalTime as number,
                                    burstTime as number,
                                    undefined,
                                    queueLevel,
                                    queueType
                        ))
                }
            }

            // here and only here the algorithm run
            algorithm?.run();
            setGantDiagram(algorithm?.getGant());

            // calculate average waiting time & average turn around time
            let sumOfWT: number = 0; 
            let sumOfTAT: number = 0; 
            algorithm.getProcesses().forEach( prc => {
                sumOfWT += prc.getWT();
                sumOfTAT += prc.getTAT();
            })
            setAvrgWT(sumOfWT /inputData.processes.length);
            setAvrgTAT(sumOfTAT /inputData.processes.length);

            setReady(true);
        }
    }, [algorithm])


    useEffect(() => {
        createAlgorithm();
    }, [inputData]);

    // when the user manualy go to '/output' path, if the data not ready return him back
    useEffect(() => {
        setTimeout(() => {
            if(inputData.processes.length === 0)  navigate('/');
        }, 1);
    }, [])


    return (
        <>
            {ready &&
            <div className='output-full-container'>
                <div className="any">
                    <div className="processes-output">
                        <h1>{inputData.algorithmData.algorithmType}</h1>
                        <table>
                        <thead>
                            <tr>
                                <th className='no-border'></th>
                                <th>AT</th>
                                <th>BT</th>
                                {inputData.algorithmData.algorithmType.includes('Priority') &&
                                    <th>Priority</th>}
                                {inputData.algorithmData.algorithmType.includes('Multy Level') &&
                                    <th>Queue</th>}
                                <th>CT</th>
                                <th>TAT</th>
                                <th>WT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {algorithm?.getProcesses().map( prc => (
                                    <tr 
                                        className="process-data"
                                        key={prc.getId()}>
                                            <td className='process-name'>process {prc.getId() + 1}:</td>
                                            <td className="arrival-time">{prc.getAT()}</td>
                                            <td className="burst-time">{prc.getBT()}</td>
                                            {inputData.algorithmData.algorithmType.includes('Priority') &&
                                                <td 
                                                    className='priority-value'>{prc.getPriority()}
                                                </td>}
                                            {inputData.algorithmData.algorithmType.includes('Multy Level') &&
                                                <td 
                                                    className='queue-level'>{prc.getQueueLevel() as number + 1}
                                                </td>}
                                            <td className="completion-time">{prc.getCT()}</td>
                                            <td className="turn-around-time">{prc.getTAT()}</td>
                                            <td className="waiting-time">{prc.getWT()}</td>
                                    </tr>
                                ))}
                        </tbody>
                        </table>
                    </div>
                    <div className="right-section">
                        <div className="gant-diagram-cont">
                            <div className="gant-title">Gant Diagram:</div>
                            {gantDiagram.length !== 0 && (
                                <div className="gant-diagram">
                                    {gantDiagram.map((prc, index) => {
                                        let result = [];
                                        let flag = false;

                                        if (index === (gantDiagram.length - 1)) {
                                            flag = true;
                                            result.push(
                                                    <span 
                                                        key={`${prc.processId}-${index}-${prc.arrivaleTime}`} 
                                                        className='gant-time-unit'>{prc.arrivaleTime}
                                                    </span>
                                            )}
                                        else {
                                            result.push(
                                                <span 
                                                    className='gant-time-unit' 
                                                    key={`${prc.processId}-${prc.arrivaleTime}-${index}`}>{prc.arrivaleTime}
                                                </span>
                                            )}

                                        if (prc.processId === -1) {
                                            result.push(
                                                <span 
                                                    className='gant-process-id empty-time' 
                                                    key={prc.processId}>E
                                                </span>
                                            )}
                                        else {
                                            result.push(
                                                <span 
                                                    className='gant-process-id' 
                                                    key={`${prc.processId}-${index}`}>P{prc.processId + 1}
                                                </span>
                                            )
                                        }
                                        if(flag) {
                                            result.push(
                                                    <span 
                                                        key={`${prc.processId}-${prc.leaveTime}`} 
                                                        className='gant-time-unit'>{prc.leaveTime}
                                                    </span>
                                            )
                                        }

                                        return result;
                                    })}
                                </div>
                                )}
                        </div>
                        <div className="average-cont">
                            <div className="avrg-wt">
                                <span className="text">average WT: </span>
                                <span className="value">
                                    {avrgWT.toFixed(2)}
                                </span>
                            </div>
                            <div className="avrg-tat">
                                <span className="text">average TAT: </span>
                                <span className="value">
                                    {avrgTAT.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={goBack}
                    className='back-btn'>back
                </button>
            </div>}
        </>
    )
}

export default Output;
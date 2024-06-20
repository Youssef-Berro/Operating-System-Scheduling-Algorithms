import { useState } from 'react';
import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom'
import {Input, algorithmData} from './components/Input.js';
import Output from './components/Output.js';
import { QueueType } from './classes/MultiLevelQueueTypes.js';
import { Queues } from './classes/MLQ.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// alias to the Process class attribute used to fill a useState of type Process
interface Process {
    id: number;
    arrivalTime: number | undefined;
    burstTime: number | undefined;
    completionTime: number;
    turnAroundTime: number;
    waitingTime: number;
    queueLevel?: number;
    queueType?: QueueType;
    priority?: number;
}

// contain quantum time, queue type and queue level 
type QueuesPlus = Queues & {queueLevel: number};

type OutputData = {
    algorithmData: algorithmData;
    processes: Process[];
    queues: QueuesPlus[];
}


function App() {
    const navigate  = useNavigate();
    const [inputData, setInputData] = useState<OutputData>({
        algorithmData: {algorithmType: '', nbOfProcesses: 0},
        processes: [],
        queues: []
    })


    const setInputDataFct = (data: OutputData) => {
        setInputData(data);

        // data filled go to output page
        if(data.processes.length !== 0)
            navigate('/output');
    }

    return (
        <>
            <Routes>
                <Route path='/' element={<Input setInputDataFct={setInputDataFct} />} />
                <Route path='/output' element={<Output inputData={inputData}/>} />
            </Routes>
            <ToastContainer position="top-center"  autoClose={3000}/>
        </>
    )
}

export default App

export type {
    Process,
    OutputData,
    QueuesPlus
}
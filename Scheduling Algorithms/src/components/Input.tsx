import AlgorithmInput from './AlgorithmInput'
import ProcessesInput from './ProcessesInput'
import './../css/Input.css'
import { useState, useEffect } from 'react';
import { OutputData } from '../App';

interface algorithmData {
    algorithmType: string;
    nbOfProcesses: number;
    quantumTime?: number;
    nbOfQueues?: number;
}

interface InputProrps {
    setInputDataFct: (data: OutputData) => void;
}


const Input: React.FC<InputProrps> = ({setInputDataFct}) => {
    const [displayProcessesInput, setDisplayProcessesInput] = useState<boolean>(false);

    // default value refer to empty
    const [algorithmInputData, setAlgorithmInputData] = useState<algorithmData>({
        algorithmType: '',
        nbOfProcesses: 0,
        quantumTime: undefined,
        nbOfQueues: undefined,
    })


    useEffect(() => {
        setInputDataFct({
            algorithmData: {algorithmType: '', nbOfProcesses: 0},
            processes: [],
            queues: []
        })
    }, [])


    // the following two function are for child components as props
    const setDisplayProcessesInputFct = (bool: boolean) => {
        setDisplayProcessesInput(bool);
    }

    const setAlgorithmInputDataFct = (data: algorithmData) => {
        setAlgorithmInputData(data);
    }


    return (
        <div className='max-cont-input'>
            <div className='full-container'>
                {!displayProcessesInput && <AlgorithmInput
                                            setAlgorithmInputData={setAlgorithmInputDataFct}
                                            setDisplayProcessesInput={setDisplayProcessesInputFct} />}
                {displayProcessesInput && <ProcessesInput
                                            setDisplayProcessesInput={setDisplayProcessesInputFct}
                                            setInputDataFct={setInputDataFct}
                                            algorithmData={algorithmInputData}  />}
            </div>
        </div>
    )
}

export { Input }
export type { algorithmData }

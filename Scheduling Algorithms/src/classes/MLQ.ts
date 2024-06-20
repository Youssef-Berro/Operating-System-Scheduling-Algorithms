import Process from "./Process.js";
import Algorithm from "./Algorithm.js";
import MultiLevelMinHeap from "./MultiLevelMinHeap.js";
import {QueueType, QuantumTime} from "./MultiLevelQueueTypes.js";


type Queues = {
    quantumTime: QuantumTime;
    queueType: QueueType
}

class MLQ extends Algorithm {
    protected lastTime = -1; // used to prevent enqueuing the same process multiple time
    protected priorityQueue = new MultiLevelMinHeap();
    protected queues: Queues[] = []; // levels start with 0 not 1


    public constructor(numberOfLevels: number, data: Queues[]) {
        super();
        Process.setIdCounter(0);
        for(let i = 0; i < numberOfLevels; i++) {
            this.queues.push(data[i]);
        }
    }


    // we do (this.getTmpArrivalTime() or this.getTmpBurstTime()) as number because tmpArrivalTime
    // and tmpBurstTime are optional so we should tell the compiler they are numbers
    protected override calculateCT() : void {
        this.fillTmpArrivalTime();
        this.fillTmpBurstTime();

        while(!this.finished()) {
            for(let i = 0; i < this.processes.length; i++) {
                if(((this.processes[i].getTmpArrivalTime() as number) > this.lastTime) && (
                    (this.processes[i].getTmpArrivalTime() as number) <= this.getTime()) && (
                    (this.processes[i].getTempBurstTime() as number) !== 0)
                ) {
                    this.priorityQueue.enQueue({ 
                            id: this.processes[i].getId(),
                            arrivalTime: this.processes[i].getTmpArrivalTime() as number,
                            burstTime: this.processes[i].getTempBurstTime() as number,
                            queueLevel: this.processes[i].getQueueLevel() as number,
                            queueType: this.processes[i].getQueueType() as ("FCFS" | "SJF" | "RR")
                    })
                }
            }

            this.lastTime = this.getTime();


            if((this.priorityQueue.isEmpty()) && (!this.finished())) {
                this.addToGant({processId: -1, 
                    arrivaleTime: this.getTime(), 
                    leaveTime: this.getTime() + 1});
                this.setTime(this.getTime() + 1);
            }
            else {
                let currProcessId = this.priorityQueue.Front();
                this.priorityQueue.deQueue();

                const index = this.processes.findIndex( process => process.getId() === currProcessId);
                const currProcessQueueLevel = (this.processes[index].getQueueLevel() as number); 
                let currentProcessQuantum = (this.queues[currProcessQueueLevel]?.queueType === "RR") ?
                        this.queues[currProcessQueueLevel].quantumTime : undefined;

                while(true) {
                    let higherProcessArrive = false;
                    this.processes[index]
                            .setTempBurstTime((this.processes[index].getTempBurstTime() as number) - 1);

                this.addToGant({processId: currProcessId, 
                    arrivaleTime: this.getTime(), 
                    leaveTime: this.getTime() + 1});
                this.setTime(this.getTime() + 1);


                    if((this.processes[index].getTempBurstTime() as number) === 0) {
                        this.processes[index].setCT(this.getTime());
                        this.incrementNbOfFinishedProcesses();
                        break;
                    }
                    this.processes[index].setTmpArrivalTime(this.getTime());

                    if(currentProcessQuantum !== undefined) {
                        if(currentProcessQuantum === 1)   break;
                        currentProcessQuantum--;
                    }


                    for(let i = 0; i < this.processes.length; i++) {
                        if((this.processes[i].getTmpArrivalTime() === this.getTime()) && (
                            (this.processes[i].getQueueLevel() as number) < currProcessQueueLevel
                        )) {
                            higherProcessArrive = true;
                            break;
                        }
                    }

                    if(higherProcessArrive)   break;
                }
            }
        }
    }


    private compareTwoProcess(prc1: Process, prc2: Process): number {
        if(prc1.getAT() < prc2.getAT())   return -1;
        else if(prc1.getAT() > prc2.getAT())   return 1;
        else if((prc1.getQueueLevel() as number) < (prc2.getQueueLevel() as number))  return -1;
        else if((prc1.getQueueLevel() as number) > (prc2.getQueueLevel() as number))  return 1;
        else {
            // return 0 because now the priority is about id, and the id are already sorted
            if((prc1.getQueueType() === "FCFS") || (prc1.getQueueType() === "RR"))   return 0; 
            else{ // mean prc1.getQueueType() === "SJF"
                if(prc1.getBT() < prc2.getBT())   return -1;
                else if(prc1.getBT() > prc2.getBT())    return 1;
                else   return 0;
            }
        }
    }


    protected override sort() : void {
        this.processes.sort(this.compareTwoProcess);
        this.setTime(this.processes[0].getAT());

        if(this.getTime() !== 0) {
            this.addToGant({processId: -1, 
                arrivaleTime: 0, 
                leaveTime: this.getTime()});
        }
    }


    protected override finished() : boolean {
        return this.getNbOfFinishedProcesses() >= this.processes.length;
    }
}


export { MLQ };
export type { Queues };

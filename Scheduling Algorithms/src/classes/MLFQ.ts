import { MLQ, Queues } from "./MLQ.js";

class MLFQ extends MLQ {
    public constructor(numberOfLevels: number, data: Queues[]) {
        super(numberOfLevels, data);
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
                        if(currentProcessQuantum === 1) {
                            if(currProcessQueueLevel === (this.queues.length - 1)) {
                                this.processes[index].setQueueLevel(0);
                                this.processes[index].setQueueType(this.queues[0].queueType);
                            }else {
                                this.processes[index].setQueueLevel(currProcessQueueLevel + 1);
                                const nextQueueType = this.queues[currProcessQueueLevel + 1].queueType;
                                this.processes[index].setQueueType(nextQueueType);
                            }
                            break;
                        }
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
}


export { MLFQ }
export type { Queues };

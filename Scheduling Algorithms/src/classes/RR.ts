import Algorithm from "./Algorithm.js";
import OnePriorityFactorMinHeap from "./OnePriorityFactorMinHeap.js";
import Process from "./Process.js";

class RR extends Algorithm {
    private priorityQueue = new OnePriorityFactorMinHeap();
    private nbOfReadyProcesses = 0;
    private quantumTime: number;

    public constructor(quantumTime: number) {
        super();
        Process.setIdCounter(0);
        this.quantumTime = quantumTime;
    }

    protected override calculateCT() : void {
        this.fillTmpArrivalTime();
        this.fillTmpBurstTime();

        // we do (this.getTmpArrivalTime() or this.getTmpBurstTime()) as number because tmpArrivalTime
        // and tmpBurstTime are optional so we should tell the compiler they are numbers
        while(!this.finished()) {
            for(let i = this.nbOfReadyProcesses; (i < this.processes.length) && (
                            (this.processes[i].getTmpArrivalTime() as number) <= this.getTime()); i++) {

                    this.priorityQueue.enQueue({ id: this.processes[i].getId(), 
                        priorityFactor: (this.processes[i].getTmpArrivalTime() as number) });
                    this.nbOfReadyProcesses++;
            }

            // if there is processes not finish there execution, and not ready => increment the time
            if((this.priorityQueue.isEmpty()) && (!this.finished())) {
                this.addToGant({processId: -1, 
                    arrivaleTime: this.getTime(), 
                    leaveTime: this.getTime() + 1});
                this.setTime(this.getTime() + 1);
            }
            else {
                let currProcessId = this.priorityQueue.Front();
                const processGantArrival = this.getTime();
                this.priorityQueue.deQueue();

                const index = this.processes.findIndex( process => process.getId() === currProcessId);
                if((this.processes[index].getTempBurstTime() as number) <= this.quantumTime) {
                    this.setTime(this.getTime() + (this.processes[index].getTempBurstTime() as number));
                    this.processes[index].setTempBurstTime(0);
                    this.processes[index].setCT(this.getTime());
                    this.incrementNbOfFinishedProcesses();
                }else {
                    this.setTime(this.getTime() + this.quantumTime);
                    const currBT = (this.processes[index].getTempBurstTime() as number);
                    this.processes[index].setTempBurstTime(currBT - this.quantumTime);
                    this.processes[index].setTmpArrivalTime(this.getTime());
                    this.priorityQueue.enQueue({ id: this.processes[index].getId(),
                        priorityFactor: (this.processes[index].getTmpArrivalTime() as number) });
                }

                const processGantLeave = this.getTime();
                this.addToGant({processId: currProcessId, 
                    arrivaleTime: processGantArrival, 
                    leaveTime: processGantLeave});
            }
        }
    }

    private compareTwoProcess(prc1: Process, prc2: Process): number {
        if(prc1.getAT() < prc2.getAT())   return -1;
        else if(prc1.getAT() > prc2.getAT())   return 1;
        else  return 0;
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

export default RR;
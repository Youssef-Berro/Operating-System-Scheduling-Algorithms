import Algorithm from "./Algorithm.js";
import Process from "./Process.js";
import OnePriorityFactorMinHeap from "./OnePriorityFactorMinHeap.js";

class SJF extends Algorithm {
    private priorityQueue = new OnePriorityFactorMinHeap();
    private nbOfReadyProcesses = 0;

    public constructor() {
        super();
        Process.setIdCounter(0);
    }

    protected override calculateCT() : void {
        while(!this.finished()) {
            for(let i = this.nbOfReadyProcesses; (i < this.processes.length) && (
                        this.processes[i].getAT() <= this.getTime()); i++) {

                this.priorityQueue.enQueue({ 
                            id: this.processes[i].getId(), 
                            priorityFactor: this.processes[i].getBT()
                })

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
                this.priorityQueue.deQueue();

                const index = this.processes.findIndex(process => process.getId() === currProcessId);
                const processGantArrival = this.getTime();
                this.setTime(this.getTime() + this.processes[index].getBT());
                const processGantLeave = this.getTime();
                this.processes[index].setCT(this.getTime());


                this.incrementNbOfFinishedProcesses();
                this.addToGant({processId: currProcessId, 
                    arrivaleTime: processGantArrival, 
                    leaveTime: processGantLeave});
            }
        }
    }

    private compareTwoProcess(prc1: Process, prc2: Process): number {
        if(prc1.getAT() < prc2.getAT())  return -1;
        if(prc1.getAT() > prc2.getAT())  return 1;
        else {
            if(prc1.getBT() < prc2.getBT())   return -1;
            else if(prc1.getBT() > prc2.getBT())    return 1;
            else   return 0;
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

export default SJF;
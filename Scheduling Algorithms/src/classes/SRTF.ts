import Process from "./Process.js";
import Algorithm from "./Algorithm.js";
import OnePriorityFactorMinHeap from "./OnePriorityFactorMinHeap.js";

class SRTF extends Algorithm {
    private priorityQueue = new OnePriorityFactorMinHeap();
    private nbOfReadyProcesses = 0;


    public constructor() {
        super();
        Process.setIdCounter(0);
    }

    // we do (this.getTmpArrivalTime() or this.getTmpBurstTime()) as number because tmpArrivalTime
    // and tmpBurstTime are optional so we should tell the compiler they are numbers
    protected calculateCT() : void {
        this.fillTmpArrivalTime();
        this.fillTmpBurstTime();


        while(!this.finished()) {
            for(let i = this.nbOfReadyProcesses; (i < this.processes.length) && (
                            (this.processes[i].getTmpArrivalTime() as number) <= this.getTime()); i++) {

                this.priorityQueue.enQueue({ 
                            id: this.processes[i].getId(),
                            priorityFactor: (this.processes[i].getTempBurstTime() as number),
                })

                this.nbOfReadyProcesses++;
            }


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
                this.processes[index].setTempBurstTime((this.processes[index].getTempBurstTime() as number) - 1);

                this.addToGant({processId: currProcessId, 
                    arrivaleTime: this.getTime(), 
                    leaveTime: this.getTime() + 1});
                this.setTime(this.getTime() + 1);

                if(this.processes[index].getTempBurstTime() === 0) {
                    this.processes[index].setCT(this.getTime());
                    this.incrementNbOfFinishedProcesses();
                }else {
                    this.processes[index].setTmpArrivalTime(this.getTime());
                    this.priorityQueue.enQueue({ 
                        id: this.processes[index].getId(),
                        priorityFactor: (this.processes[index].getTempBurstTime() as number),
                    })
                }
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

    protected sort() : void {
        this.processes.sort(this.compareTwoProcess);
        this.setTime(this.processes[0].getAT());

        if(this.getTime() !== 0) {
            this.addToGant({processId: -1, 
                arrivaleTime: 0, 
                leaveTime: this.getTime()});
        }
    }


    protected finished() : boolean {
        return this.getNbOfFinishedProcesses() >= this.processes.length;
    }
}

export default SRTF;
import Process from "./Process.js";

type GantData = {
    processId: number;
    arrivaleTime: number;
    leaveTime: number;
}

// Each algorithm type extend the Algorithm class because most attributes and method
// are common between algorothms
abstract class Algorithm {
    protected processes: Process[] = [];
    private gantDiagram: GantData[] = [];
    private time: number = 0;
    private nbOfFinishedProcesses: number = 0;


    protected getTime(): number {
        return this.time;
    }

    protected setTime(time: number): void {
        this.time = time;
    }

    public getProcesses():Process[] {
        return this.processes;
    }

    protected getNbOfFinishedProcesses(): number {
        return this.nbOfFinishedProcesses;
    }

    protected addToGant(data: GantData): void {
        this.gantDiagram.push(data);
    }

    public getGant(): GantData[] {
        return this.gantDiagram;
    }


    // in some cases the algorithm work unit by unit respecting to preemtive and listenning
    // for new arrived processes, so maybe the same process are in the gant in 2 or more 
    // consecutive indexes, then we must collabse it
    private collabseGant(): void {
        if(this.gantDiagram.length <= 1)   return; 

        const result: GantData[] = [];
        let currentElement: GantData | null = null;

        for (let prc of this.gantDiagram) {
            if((currentElement === null) || (currentElement.processId !== prc.processId)) {
                result.push(prc);
                currentElement = prc;
            } 
            else  currentElement.leaveTime = prc.leaveTime;
        }

        this.gantDiagram = result;
    }

    protected incrementNbOfFinishedProcesses(): void {
        this.nbOfFinishedProcesses++;
    }

    public addProcess(prcs: Process): void {
        this.processes.push(prcs);
    }

    private sortById(): void {
        this.processes.sort( (a, b) => a.getId() - b.getId());
    }

    private calculateTAT() : void {
        for(let i = 0; i < this.processes.length; i++) {
            const arrivalTime = this.processes[i].getAT();
            const completionTime = this.processes[i].getCT();

            this.processes[i].setTAT(completionTime - arrivalTime);
        }
    }

    private calculateWT() : void {
        for(let i = 0; i < this.processes.length; i++) {
            const turnAroundTime = this.processes[i].getTAT();
            const burstTime = this.processes[i].getBT();

            this.processes[i].setWT(turnAroundTime - burstTime);
        }
    }


    // the following 2 methods are used in preemtive and round robin algorithms
    protected fillTmpArrivalTime(): void {
        for(let i = 0; i < this.processes.length; i++)
            this.processes[i].setTmpArrivalTime(this.processes[i].getAT());
    }

    protected fillTmpBurstTime(): void {
        for(let i = 0; i < this.processes.length; i++)
            this.processes[i].setTempBurstTime(this.processes[i].getBT());
    }


    // after first sort we need to set time to first process arrival time
    protected abstract sort() : void;
    protected abstract calculateCT() : void;
    protected abstract finished() : boolean;


    public run(): void {
        this.sort();
        this.calculateCT();
        this.calculateTAT();
        this.calculateWT();
        this.sortById();
        this.collabseGant();
    }
}

export default Algorithm;
export type {GantData} 


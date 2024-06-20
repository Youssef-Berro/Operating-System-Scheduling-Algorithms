import {QueueType} from "./MultiLevelQueueTypes.js";

class Process {
    private static ID_COUNTER: number = 0;
    private id: number;
    private arrivalTime: number;
    private burstTime: number;
    private completionTime: number = 0;
    private turnAroundTime: number = 0;
    private waitingTime: number = 0;

    // optional attrb
    private queueLevel?: number;
    private queueType?: QueueType;
    private priority?: number;

    // temporary attrb
    private tempArrivalTime?: number;
    private tempBurstTime?: number;

    constructor(arrivalTime: number, burstTime: number, priority: number = -1, 
                queueLevel?: number, queueType?: QueueType) {

        this.arrivalTime = arrivalTime;
        this.priority = priority;
        this.burstTime = burstTime;
        this.id = Process.ID_COUNTER;
        Process.ID_COUNTER++;

        if(queueLevel !== undefined)  this.queueLevel = queueLevel;
        if(queueType !== undefined)  this.queueType = queueType;
        if(priority !== -1)  this.priority = priority;
    }


    // getters and setters
    public getWT(): number {
        return this.waitingTime;
    }

    public setWT(waitingTime: number): void {
        this.waitingTime = waitingTime;
    }

    public getTAT(): number {
        return this.turnAroundTime;
    }

    public setTAT(turnAroundTime: number): void {
        this.turnAroundTime = turnAroundTime;
    }

    public getCT(): number {
        return this.completionTime;
    }

    public setCT(completionTime: number): void {
        this.completionTime = completionTime;
    }

    public getAT(): number {
        return this.arrivalTime;
    }

    public getBT(): number {
        return this.burstTime;
    }

    public getId(): number {
        return this.id;
    }

    public getQueueLevel(): number | undefined {
        return this.queueLevel ?? undefined;
    }

    public getQueueType(): QueueType | undefined {
        return this.queueType ?? undefined;
    }

    public setQueueLevel(level: number): void {
        this.queueLevel = level;
    }

    public setQueueType(type: QueueType): void {
        this.queueType = type;
    }

    public getPriority(): number | undefined {
        return this.priority ?? undefined;
    }

    public getTmpArrivalTime(): number | undefined {
        return this.tempArrivalTime ?? undefined;
    }

    public setTmpArrivalTime(tmpAT: number): void {
        this.tempArrivalTime = tmpAT;
    }

    public getTempBurstTime(): number | undefined {
        return this.tempBurstTime ?? undefined;
    }

    public setTempBurstTime(tmpBT: number): void {
        this.tempBurstTime = tmpBT;
    }

    public static setIdCounter(val: number): void {
        Process.ID_COUNTER = val;
    }
}

export default Process;
import {QueueType} from "./MultiLevelQueueTypes.js";

type prcsType1 = {
    id: number;
    priorityFactor: number;
}

type prcsType2 = {
    id: number;
    priorityFactor1: number;
    priorityFactor2: number;
}

type prcsType3 = {
    id: number;
    arrivalTime: number;
    burstTime: number;
    queueLevel: number;
    queueType: QueueType;
}

abstract class MinHeap {
    protected arr: (prcsType1 | prcsType2 | prcsType3)[];
    private count: number;
    private static MAX_LEN: number = 50;

    public constructor() {
        this.arr = [];
        this.count = 0;
    }

    public getCount(): number {
        return this.count;
    }

    public static getMaxLen(): number {
        return MinHeap.MAX_LEN;
    }

    protected parent(index: number): number {
        if((index > 0) && (index < this.count))
            return Math.floor((index - 1) / 2);

        return -1;
    }

    protected leftChild(index: number): number {
        let left = (index * 2) + 1;
        if((index >= 0) && (left < this.count))
            return left;

        return -1;
    }

    protected rightChild(index: number): number {
        let right = (index * 2) + 2;
        if((index >= 0) && (right < this.count))
            return right;

        return -1;
    }

    public isEmpty(): boolean {
        return this.count === 0;
    }

    public isFull(): boolean {
        return this.count === MinHeap.MAX_LEN;
    }

    protected abstract percolateDown(index: number): void;
    protected abstract percolateUp(index: number): void;

    public Front(): number {
        if(this.isEmpty())   return -1;

        return this.arr[0].id;
    }

    public deQueue(): boolean {
        if(this.isEmpty())   return false;

        if(this.count === 1) {
            this.count = 0; // now the heap is empty
            return true;
        }

        this.arr[0] = this.arr[this.count - 1];
        this.count--;
        this.percolateDown(0);
        return true;
    }

    public enQueue(el: prcsType1 | prcsType2 | prcsType3): boolean {
        if(this.isFull())  {
            console.log("error");
            return false;
        }

        this.arr[this.count] = el;
        this.count++;
        this.percolateUp(this.count - 1);
        return true;
    }
}

export {
    MinHeap
}

export type {
    prcsType1,
    prcsType2,
    prcsType3
}

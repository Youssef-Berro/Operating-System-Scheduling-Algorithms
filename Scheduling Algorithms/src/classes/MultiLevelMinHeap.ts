import { MinHeap, prcsType3 } from './MinHeap.js';

class MultiLevelMinHeap extends MinHeap {
    public constructor() {
        super();
    }


    private shouldUpdateForFCFSRR(prc1: prcsType3, prc2: prcsType3): boolean {
        return ((prc1.arrivalTime < prc2.arrivalTime) ||
                    (prc1.arrivalTime === prc2.arrivalTime && prc1.id < prc2.id))
    }

    private shouldUpdateForSJF(prc1: prcsType3, prc2: prcsType3): boolean {
        return ((prc1.burstTime < prc2.burstTime) ||
                (prc1.burstTime === prc2.burstTime && prc1.id < prc2.id))
    }

    protected override percolateDown(index: number): void {
        if((index >= this.getCount()) || (index < 0))   return;

        let left = this.leftChild(index);
        let right = this.rightChild(index);
        let min = index;
        let minProcess = this.arr[min] as prcsType3;

        if(left !== -1) {
            const leftProcess = this.arr[left] as prcsType3;

            if(leftProcess.queueLevel < minProcess.queueLevel)  min = left;
            else if(leftProcess.queueLevel === minProcess.queueLevel) {
                if(((leftProcess.queueType === 'FCFS' || leftProcess.queueType === 'RR')) && this.shouldUpdateForFCFSRR(leftProcess, minProcess)) 
                    min = left;
                else if(leftProcess.queueType === 'SJF' && this.shouldUpdateForSJF(leftProcess, minProcess)) 
                    min = left;
            }
        }

        // maybe the min index become the left, so we must update the minProcess
        minProcess = this.arr[min] as prcsType3; 


        if(right !== -1) {
            const rightProcess = this.arr[right] as prcsType3;

            if(rightProcess.queueLevel < minProcess.queueLevel)  min = right;
            else if(rightProcess.queueLevel === minProcess.queueLevel) {
                if(((rightProcess.queueType === 'FCFS' || rightProcess.queueType === 'RR')) && this.shouldUpdateForFCFSRR(rightProcess, minProcess)) 
                    min = right;
                else if(rightProcess.queueType === 'SJF' && this.shouldUpdateForSJF(rightProcess, minProcess)) 
                    min = right;
            }
        }

        if(min === index)    return;

        [this.arr[index], this.arr[min]] = [this.arr[min], this.arr[index]];
        this.percolateDown(min);
    }

    protected override percolateUp(index: number): void {
        let p = this.parent(index);
        if(p === -1 || !this.arr[p]) return;
        const parentProcess = this.arr[p] as prcsType3;

        if(index > 0) {
            const currProcess = this.arr[index] as prcsType3;

            if(currProcess.queueLevel < parentProcess.queueLevel) {
                [this.arr[index], this.arr[p]] = [this.arr[p], this.arr[index]];
                this.percolateUp(p);
            } else if(currProcess.queueLevel === parentProcess.queueLevel) {
                if(
                    (currProcess.queueType === 'FCFS' || currProcess.queueType === 'RR') &&
                    this.shouldUpdateForFCFSRR(currProcess, parentProcess)
                ) {
                    [this.arr[index], this.arr[p]] = [this.arr[p], this.arr[index]];
                    this.percolateUp(p);
                } else if((currProcess.queueType === 'SJF') && 
                    (this.shouldUpdateForSJF(currProcess, parentProcess))) {
                        [this.arr[index], this.arr[p]] = [this.arr[p], this.arr[index]];
                        this.percolateUp(p);
                }
            }
        }
    }
    
}

export default MultiLevelMinHeap;
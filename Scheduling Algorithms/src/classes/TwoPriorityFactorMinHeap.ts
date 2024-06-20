import { MinHeap, prcsType2 } from "./MinHeap.js";

class TwoPriorityFactorMinHeap extends MinHeap {
    public constructor() {
        super();
    }

    protected override percolateDown(index: number): void {
        if((index >= this.getCount()) || (index < 0)) return;

        let left = this.leftChild(index);
        let right = this.rightChild(index);
        let min = index;

        if((left !== -1) && (
            (this.arr[left] as prcsType2).priorityFactor1 < (this.arr[min] as prcsType2).priorityFactor1 ||
                ((this.arr[left] as prcsType2).priorityFactor1 === (this.arr[min] as prcsType2).priorityFactor1 &&
                    (this.arr[left] as prcsType2).priorityFactor2 < (this.arr[min] as prcsType2).priorityFactor2) ||
                ((this.arr[left] as prcsType2).priorityFactor1 === (this.arr[min] as prcsType2).priorityFactor1 &&
                    (this.arr[left] as prcsType2).priorityFactor2 === (this.arr[min] as prcsType2).priorityFactor2 &&
                    (this.arr[left] as prcsType2).id < (this.arr[min] as prcsType2).id)
        ))   min = left;


        if((right !== -1) && (
            (this.arr[right] as prcsType2).priorityFactor1 < (this.arr[min] as prcsType2).priorityFactor1 ||
                ((this.arr[right] as prcsType2).priorityFactor1 === (this.arr[min] as prcsType2).priorityFactor1 &&
                    (this.arr[right] as prcsType2).priorityFactor2 < (this.arr[min] as prcsType2).priorityFactor2) ||
                ((this.arr[right] as prcsType2).priorityFactor1 === (this.arr[min] as prcsType2).priorityFactor1 &&
                    (this.arr[right] as prcsType2).priorityFactor2 === (this.arr[min] as prcsType2).priorityFactor2 &&
                    (this.arr[right] as prcsType2).id < (this.arr[min] as prcsType2).id)
        ))    min = right;



        if(min === index) return;

        [this.arr[index], this.arr[min]] = [this.arr[min], this.arr[index]];
        this.percolateDown(min);
    }

    protected override percolateUp(index: number): void {
        let p = this.parent(index);

        if((index > 0) && (this.arr[p]) &&
            ((this.arr[index] as prcsType2).priorityFactor1 < (this.arr[p] as prcsType2).priorityFactor1 ||
                ((this.arr[index] as prcsType2).priorityFactor1 === (this.arr[p] as prcsType2).priorityFactor1 &&
                    (this.arr[index] as prcsType2).priorityFactor2 < (this.arr[p] as prcsType2).priorityFactor2) ||
                ((this.arr[index] as prcsType2).priorityFactor1 === (this.arr[p] as prcsType2).priorityFactor1 &&
                    (this.arr[index] as prcsType2).priorityFactor2 === (this.arr[p] as prcsType2).priorityFactor2 &&
                    (this.arr[index] as prcsType2).id < (this.arr[p] as prcsType2).id)
        )) {
            [this.arr[index], this.arr[p]] = [this.arr[p], this.arr[index]];
            this.percolateUp(p);
        }
    }
}

export default TwoPriorityFactorMinHeap;

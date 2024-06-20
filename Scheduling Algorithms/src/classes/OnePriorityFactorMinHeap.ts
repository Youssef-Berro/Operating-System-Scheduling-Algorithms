import { MinHeap, prcsType1 } from "./MinHeap.js";

class OnePriorityFactorMinHeap extends MinHeap {
    public constructor() {
        super();
    }

    protected override percolateDown(index: number): void {
        if((index >= this.getCount()) || (index < 0))   return;

        let left = this.leftChild(index);
        let right = this.rightChild(index);
        let min = index;

        if((left !== -1) && (
            (this.arr[left] as prcsType1).priorityFactor < (this.arr[min] as prcsType1).priorityFactor ||
            ((this.arr[left] as prcsType1).priorityFactor === (this.arr[min] as prcsType1).priorityFactor &&
            this.arr[left].id < this.arr[min].id)
        ))    min = left;


            if((right !== -1) && (
                (this.arr[right] as prcsType1).priorityFactor < (this.arr[min] as prcsType1).priorityFactor ||
                ((this.arr[right] as prcsType1).priorityFactor === (this.arr[min] as prcsType1).priorityFactor &&
                (this.arr[right] as prcsType1).id < this.arr[min].id)
            ))    min = right;

        if(min === index) return;

        [this.arr[index], this.arr[min]] = [this.arr[min], this.arr[index]];
        this.percolateDown(min);
    }

    protected override percolateUp(index: number): void {
        let p = this.parent(index);

        if((index > 0) && this.arr[p] && (
            ((this.arr[index] as prcsType1).priorityFactor < (this.arr[p] as prcsType1).priorityFactor) ||
            (((this.arr[index] as prcsType1).priorityFactor === (this.arr[p] as prcsType1).priorityFactor) && (
            this.arr[index].id < this.arr[p].id))
        )) {
            [this.arr[index], this.arr[p]] = [this.arr[p], this.arr[index]];
            this.percolateUp(p);
        }
    }

}


export default OnePriorityFactorMinHeap;
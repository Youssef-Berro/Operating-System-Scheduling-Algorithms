class Queue {
    private arr: number[];
    private front: number;
    private rear: number;
    private static MAX_LEN: number = 50;

    public constructor() {
        this.arr = [];
        this.front = 0;
        this.rear = -1;
    }

    public isFull(): boolean {
        return this.arr.length === Queue.MAX_LEN;
    }

    public isEmpty(): boolean {
        return this.rear < this.front;
    }

    public enQueue(el: number): boolean {
        if(!this.isFull()) {
            this.rear++;
            this.arr.push(el);
            return true;
        }

        return false;
    }

    public deQueue(): boolean {
        if(!this.isEmpty()) {
            this.front++;
            return true;
        }

        console.log("error")
        return false;
    }

    public Front(): number {
        if(!this.isEmpty()) {
            return this.arr[this.front];
        }

        return -1;
    }
}

export default Queue;

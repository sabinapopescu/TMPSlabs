class Connection {
    id;
    constructor(id) {
        this.id = id;
    }
    exec(sql) { return `[conn ${this.id}] ${sql}`; }
}
export class ConnectionPool {
    max;
    free = [];
    used = new Set();
    nextId = 1;
    constructor(max = 2) {
        this.max = max;
    }
    acquire() {
        if (this.free.length) {
            const c = this.free.pop();
            this.used.add(c);
            return c;
        }
        if (this.used.size < this.max) {
            const c = new Connection(this.nextId++);
            this.used.add(c);
            return c;
        }
        throw new Error("No connections available");
    }
    release(c) { if (this.used.delete(c))
        this.free.push(c); }
}

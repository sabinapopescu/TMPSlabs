class Connection {
    constructor(public id: number) {}
    exec(sql: string){ return `[conn ${this.id}] ${sql}`; }
  }
  export class ConnectionPool {
    private free: Connection[] = [];
    private used = new Set<Connection>();
    private nextId = 1;
  
    constructor(private max = 2) {}
  
    acquire(): Connection {
      if (this.free.length) { const c = this.free.pop()!; this.used.add(c); return c; }
      if (this.used.size < this.max) { const c = new Connection(this.nextId++); this.used.add(c); return c; }
      throw new Error("No connections available");
    }
  
    release(c: Connection){ if (this.used.delete(c)) this.free.push(c); }
  }
  
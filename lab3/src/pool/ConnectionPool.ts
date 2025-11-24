/**
 * Connection class - represents a database connection
 */
class Connection {
  constructor(public readonly id: number) {}

  /**
   * Execute a SQL query
   */
  exec(sql: string): string {
    if (!sql || sql.trim().length === 0) {
      throw new Error("SQL query cannot be empty");
    }
    return `[Connection ${this.id}] Executed: ${sql}`;
  }

  /**
   * Check if connection is healthy
   */
  isHealthy(): boolean {
    return true; // Simplified - in real world, would check actual connection
  }

  /**
   * Close the connection
   */
  close(): void {
    // In real implementation, would close actual connection
    console.log(`Connection ${this.id} closed`);
  }
}

/**
 * Object Pool Pattern Implementation
 * Manages a pool of reusable database connections
 */
export class ConnectionPool {
  private free: Connection[] = [];
  private used: Set<Connection> = new Set();
  private nextId: number = 1;
  private readonly maxConnections: number;

  constructor(max: number = 5) {
    if (max <= 0) {
      throw new Error("Maximum connections must be greater than 0");
    }
    if (max > 100) {
      throw new Error("Maximum connections is too high (max 100)");
    }
    this.maxConnections = max;
  }

  /**
   * Acquire a connection from the pool
   */
  acquire(): Connection {
    // Try to reuse a free connection
    if (this.free.length > 0) {
      const connection = this.free.pop()!;
      this.used.add(connection);
      console.log(`Reused connection ${connection.id} from pool`);
      return connection;
    }

    // Create a new connection if we haven't reached the limit
    if (this.used.size < this.maxConnections) {
      const connection = new Connection(this.nextId++);
      this.used.add(connection);
      console.log(`Created new connection ${connection.id}`);
      return connection;
    }

    // Pool is exhausted
    throw new Error(
      `Connection pool exhausted. Max ${this.maxConnections} connections reached. ` +
      `Currently in use: ${this.used.size}, Available: ${this.free.length}`
    );
  }

  /**
   * Release a connection back to the pool
   */
  release(connection: Connection): void {
    if (!connection) {
      throw new Error("Cannot release null connection");
    }

    if (!this.used.has(connection)) {
      console.warn(`Connection ${connection.id} was not acquired from this pool`);
      return;
    }

    if (!connection.isHealthy()) {
      console.warn(`Connection ${connection.id} is unhealthy, discarding`);
      this.used.delete(connection);
      connection.close();
      return;
    }

    this.used.delete(connection);
    this.free.push(connection);
    console.log(`Released connection ${connection.id} back to pool`);
  }

  /**
   * Get the number of available connections
   */
  getAvailableCount(): number {
    return this.free.length;
  }

  /**
   * Get the number of connections in use
   */
  getInUseCount(): number {
    return this.used.size;
  }

  /**
   * Get the total number of connections (created)
   */
  getTotalConnections(): number {
    return this.free.length + this.used.size;
  }

  /**
   * Get the maximum allowed connections
   */
  getMaxConnections(): number {
    return this.maxConnections;
  }

  /**
   * Check if the pool has available capacity
   */
  hasCapacity(): boolean {
    return this.used.size < this.maxConnections;
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    available: number;
    inUse: number;
    total: number;
    max: number;
    utilizationPercent: number;
  } {
    const total = this.getTotalConnections();
    const utilizationPercent = total > 0 ? (this.used.size / this.maxConnections) * 100 : 0;

    return {
      available: this.free.length,
      inUse: this.used.size,
      total,
      max: this.maxConnections,
      utilizationPercent: Math.round(utilizationPercent)
    };
  }

  /**
   * Clear all connections and reset the pool
   */
  clear(): void {
    // Close all free connections
    for (const conn of this.free) {
      conn.close();
    }

    // Close all used connections
    for (const conn of this.used) {
      conn.close();
    }

    this.free = [];
    this.used.clear();
    console.log("Connection pool cleared");
  }

  /**
   * Drain the pool - wait for all connections to be released
   */
  async drain(timeoutMs: number = 5000): Promise<void> {
    const startTime = Date.now();

    while (this.used.size > 0) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Pool drain timeout after ${timeoutMs}ms. ${this.used.size} connections still in use.`);
      }

      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.clear();
  }

  /**
   * Execute a query with automatic connection management
   */
  async withConnection<T>(callback: (conn: Connection) => T | Promise<T>): Promise<T> {
    const connection = this.acquire();
    
    try {
      const result = await callback(connection);
      this.release(connection);
      return result;
    } catch (error) {
      this.release(connection);
      throw error;
    }
  }
}

/**
 * Singleton wrapper for ConnectionPool
 */
export class DatabasePool {
  private static instance: ConnectionPool | null = null;

  private constructor() {}

  static getInstance(maxConnections: number = 5): ConnectionPool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new ConnectionPool(maxConnections);
    }
    return DatabasePool.instance;
  }

  static reset(): void {
    if (DatabasePool.instance) {
      DatabasePool.instance.clear();
      DatabasePool.instance = null;
    }
  }
}

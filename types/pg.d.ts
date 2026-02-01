declare module 'pg' {
  export class Pool {
    constructor(config?: any);
    connect(): Promise<any>;
    end(): Promise<void>;
  }
  export class Client {
    constructor(config?: any);
    connect(): Promise<void>;
    end(): Promise<void>;
    query(queryText: string, values?: any[]): Promise<any>;
  }
}

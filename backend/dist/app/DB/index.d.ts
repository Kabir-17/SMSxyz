import mongoose from 'mongoose';
declare class Database {
    private static instance;
    private constructor();
    static getInstance(): Database;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnection(): mongoose.Connection;
    dropDatabase(): Promise<void>;
    clearCollections(): Promise<void>;
    isConnected(): boolean;
}
export declare const database: Database;
export { mongoose };
export default database;
//# sourceMappingURL=index.d.ts.map
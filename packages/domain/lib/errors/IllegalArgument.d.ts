export declare class IllegalArgument extends Error {
    status: number;
    statusText: string;
    constructor(status: number | undefined, statusText: string, message?: string, context?: any);
}

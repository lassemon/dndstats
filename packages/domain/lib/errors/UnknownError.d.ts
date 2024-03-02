export declare class UnknownError extends Error {
    status: number;
    statusText: string;
    constructor(status: number, statusText: string, message?: string);
}

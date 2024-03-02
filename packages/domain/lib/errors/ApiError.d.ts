/**
 * @tsoaModel
 */
export declare class ApiError extends Error {
    status: number;
    statusText: string;
    context?: any;
    constructor(status: number, statusText: string, message?: string, context?: any);
}

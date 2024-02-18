export default class Logger {
    DATE_FORMAT: string;
    name: string;
    constructor(name: string, dateFormat?: string);
    debug(message: unknown, ...args: any[]): void;
    info(message: unknown, ...args: any[]): void;
    warn(message: unknown, ...args: any[]): void;
    error(message: unknown, ...args: any[]): void;
    private formatMessage;
    private getTimestamp;
}

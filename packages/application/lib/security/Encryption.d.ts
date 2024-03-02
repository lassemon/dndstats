export declare class Encryption {
    static encrypt(clearText: string): Promise<string>;
    static compare(clearText: string, hash: string): Promise<boolean>;
}

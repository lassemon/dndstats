export interface UseCaseOptionsInterface {
    invalidArgument: (argName: string) => void;
    unknownError: (e?: unknown) => void;
}
export interface UseCaseInterface<TOptions extends UseCaseOptionsInterface, T extends unknown> {
    execute: (options: TOptions) => Promise<T>;
}

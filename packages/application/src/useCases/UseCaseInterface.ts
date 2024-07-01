export interface UseCaseOptionsInterface {
  invalidArgument: (argName: string) => void
  unknownError: (useCaseName: string, e?: unknown) => void
}

export interface UseCaseInterface<TOptions extends UseCaseOptionsInterface, T extends unknown> {
  execute: (options: TOptions) => Promise<T>
}

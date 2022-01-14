import { Command } from "./Command";


export type CommandConstructor<T> = {
  new(...args: any[]): T
}

export abstract class CommandHandler {
  commandHandlerName(): string {
    return this.constructor.name;
  }

  abstract doExecute(command: Command): Promise<void>;

  execute(command: Command): Promise<void> {
    return this.doExecute(command);
  };

  abstract command(): CommandConstructor<Command>;
}

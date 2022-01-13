import { Command } from "./Command";

export abstract class CommandHandler {
  abstract doExecute(command: Command): Promise<void>;

  execute(command: Command): Promise<void> {
    return this.doExecute(command);
  };
}

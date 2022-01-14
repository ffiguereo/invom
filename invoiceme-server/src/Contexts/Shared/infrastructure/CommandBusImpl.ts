import { Command } from "../domain/Command";
import { CommandBus } from "../domain/CommandBus";
import { CommandHandler } from '../domain/CommandHandler';

export class CommandBusImpl implements CommandBus {
  private handlers = new Map<string, CommandHandler>();

  constructor(...handlers: CommandHandler[]) {
    this.register(handlers);
  }

  async dispatch(command: Command): Promise<void> {
    const handler = this.handlers.get(command.commandName());
    if (!handler) {
      throw new Error('CommandHandlerNotFoundException');
    }
    return handler.execute(command);
  }

  protected bind(id: string, handler: CommandHandler) {
    this.handlers.set(id, handler);
  }

  protected register(handlers: CommandHandler[] = []) {
    for (const handler of handlers) {
      this.registerHandler(handler);
    }
  }

  protected registerHandler(commandHandler: CommandHandler) {
    if (!commandHandler || !(commandHandler instanceof CommandHandler)) {
      return;
    }

    this.bind(commandHandler.command().name, commandHandler);
  }
}

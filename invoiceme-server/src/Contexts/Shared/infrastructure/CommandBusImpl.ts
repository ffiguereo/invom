import { ContainerBuilder } from 'node-dependency-injection';

import { Command } from "../domain/Command";
import { CommandBus } from "../domain/CommandBus";
import { CommandHandler } from '../domain/CommandHandler';

type Handler = {
  commandClassName: string;
  handlerContainerServiceId: string;
}

export class CommandBusImpl implements CommandBus {
  private handlers = new Map<string, CommandHandler>();
  private readonly serviceContainer: ContainerBuilder;

  constructor(serviceContainer: ContainerBuilder, handlersId: Handler[] = []) {
    this.serviceContainer = serviceContainer;
    this.register(handlersId);
  }

  async dispatch(command: Command): Promise<void> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error('CommandHandlerNotFoundException');
    }
    return handler.execute(command);
  }

  protected bind(id: string, handler: CommandHandler) {
    this.handlers.set(id, handler);
  }

  protected register(handlers: Handler[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler.commandClassName, handler.handlerContainerServiceId));
  }

  protected registerHandler(commandClassName: string, handlerContainerServiceId: string) {
    const instance = this.serviceContainer.get<CommandHandler>(handlerContainerServiceId);
    if (!instance || !(instance instanceof CommandHandler)) {
      return;
    }

    this.bind(commandClassName, instance);
  }
}

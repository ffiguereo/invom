import { ContainerBuilder } from 'node-dependency-injection';
import { Query } from '../domain/Query';

import { QueryBus } from '../domain/QueryBus';
import { QueryHandler } from '../domain/QueryHandler';
import { QueryResponse } from '../domain/QueryResponse';

type Handler = {
  queryClassName: string;
  handlerContainerServiceId: string;
}

export class QueryBusImpl implements QueryBus {
  private handlers = new Map<string, QueryHandler>();
  private readonly serviceContainer: ContainerBuilder;

  constructor(serviceContainer: ContainerBuilder, handlersId: Handler[] = []) {
    this.serviceContainer = serviceContainer;
    this.register(handlersId);
  }

  async dispatch(query: Query): Promise<QueryResponse | void> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      throw new Error('QueryHandlerNotFoundException');
    }
    return handler.execute(query);
  }

  protected bind(id: string, handler: QueryHandler) {
    this.handlers.set(id, handler);
  }

  protected register(handlers: Handler[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler.queryClassName, handler.handlerContainerServiceId));
  }

  protected registerHandler(queryClassName: string, handlerContainerServiceId: string) {
    const instance = this.serviceContainer.get<QueryHandler>(handlerContainerServiceId);
    if (!instance || !(instance instanceof QueryHandler)) {
      return;
    }

    this.bind(queryClassName, instance);
  }
}

import { Query } from '../domain/Query';

import { QueryBus } from '../domain/QueryBus';
import { QueryHandler } from '../domain/QueryHandler';
import { QueryResponse } from '../domain/QueryResponse';

export class QueryBusImpl implements QueryBus {
  private handlers = new Map<string, QueryHandler>();

  constructor(...handlers: QueryHandler[]) {
    this.register(handlers);
  }

  async dispatch(query: Query): Promise<QueryResponse | void> {
    const handler = this.handlers.get(query.queryName());
    if (!handler) {
      throw new Error('QueryHandlerNotFoundException');
    }
    return handler.execute(query);
  }

  protected bind(id: string, handler: QueryHandler) {
    this.handlers.set(id, handler);
  }

  protected register(handlers: QueryHandler[] = []) {
    for (const handler of handlers) {
      this.registerHandler(handler)
    }
  }

  protected registerHandler(queryHandler: QueryHandler) {
    if (!queryHandler || !(queryHandler instanceof QueryHandler)) {
      return;
    }

    this.bind(queryHandler.query().name, queryHandler);
  }
}

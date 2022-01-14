import { Query } from "./Query";
import { QueryResponse } from "./QueryResponse";

export type QueryConstructor<T> = {
  new(...args: any[]): T
}

export abstract class QueryHandler {
  queryHandlerName(): string {
    return this.constructor.name;
  }

  abstract doExecute(query: Query): Promise<QueryResponse | void>;

  execute(query: Query): Promise<QueryResponse | void> {
    return this.doExecute(query)
  }

  abstract query(): QueryConstructor<Query>;
}

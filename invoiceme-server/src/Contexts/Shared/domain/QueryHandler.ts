import { Query } from "./Query";
import { QueryResponse } from "./QueryResponse";

export abstract class QueryHandler {
  abstract doExecute(query: Query): Promise<QueryResponse | void>;

  execute(query: Query): Promise<QueryResponse | void> {
    return this.doExecute(query)
  }
}

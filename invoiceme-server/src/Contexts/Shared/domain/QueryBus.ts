import { Query } from "./Query";
import { QueryResponse } from "./QueryResponse";

export interface QueryBus {
  dispatch(query: Query): Promise<QueryResponse | void>;
}



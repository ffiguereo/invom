
export abstract class Query {
  queryName(): string {
    return this.constructor.name;
  }
}

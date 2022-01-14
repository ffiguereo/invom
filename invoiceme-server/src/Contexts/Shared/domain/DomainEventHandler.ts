import { DomainEvent } from "./DomainEvent";

export type DomainEventConstructor<T> = {
  new(...args: any[]): T
}

export abstract class DomainEventHandler {
  domainEventHandlerName(): string {
    return this.constructor.name;
  }

  abstract doExecute(event: DomainEvent): Promise<void>;

  execute(event: DomainEvent): Promise<void> {
    return this.doExecute(event);
  };

  abstract events(): Array<DomainEventConstructor<DomainEvent>>;
}

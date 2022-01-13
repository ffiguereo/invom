import { DomainEvent } from "./DomainEvent";

export abstract class EventHandler {
  abstract doExecute(event: DomainEvent): Promise<void>;

  execute(event: DomainEvent): Promise<void> {
    return this.doExecute(event);
  };
}

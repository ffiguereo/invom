import { DomainEvent } from "./DomainEvent";

export interface DomainEventBus {
  publish(event: DomainEvent): void;
  publishAll(events: Array<DomainEvent>): void;
}

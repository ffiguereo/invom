import { DomainEvent } from "./DomainEvent";

export interface EventBus {
  publish(event: DomainEvent): void;
  publishAll(events: Array<DomainEvent>): void;
}

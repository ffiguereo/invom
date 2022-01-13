import { Nullable } from "./Nullable";
import { Uuid } from "./value-object/Uuid";

export abstract class DomainEvent {
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: string;

  constructor(aggregateId: string, eventId: Nullable<string> = null, occurredOn: Nullable<string> = null) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || Uuid.random().toString();
    this.occurredOn = occurredOn || new Date().toISOString();
  }

  get eventName(): string {
    return this.constructor.name;
  };
}

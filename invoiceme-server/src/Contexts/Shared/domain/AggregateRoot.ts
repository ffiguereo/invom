import { DomainEvent } from "./DomainEvent";

export abstract class AggregateRoot {
  private recordedDomainEvents: Array<DomainEvent> = [];

  pullDomainEvents(): Array<DomainEvent> {
    const recordedDomainEvents = [ ...this.recordedDomainEvents];
    this.recordedDomainEvents = [];

    return recordedDomainEvents;
  }

  protected record(event: DomainEvent): void {
    this.recordedDomainEvents.push(event);
  }
}

export abstract class DomainEvent {
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly occurredOn: string = new Date().toISOString();

  constructor(aggregateId: string, aggregateName: string) {
    this.aggregateId = aggregateId;
    this.aggregateName = aggregateName;
  }

  get domainEventName(): string {
    return this.constructor.name;
  };
}

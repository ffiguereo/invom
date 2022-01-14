import { DomainEventBus } from '../../../../src/Contexts/Shared/domain/DomainEventBus';
import { DomainEvent } from '../../../../src/Contexts/Shared/domain/DomainEvent';

export class DomainEventBusMock implements DomainEventBus {
  private mockSave = jest.fn();

  publish(event: DomainEvent): void {
    this.mockSave(event);
  }

  publishAll(events: DomainEvent[]): void {
    for (const event of events) {
      this.publish(event);
    }
  }

  assertLastSavedEventIs(expected: DomainEvent): void {
    const mock = this.mockSave.mock;
    const lastSavedDomainEvent = mock.calls[mock.calls.length - 1][0] as DomainEvent;
    expect(lastSavedDomainEvent).toBeInstanceOf(DomainEvent);
    expect(lastSavedDomainEvent.aggregateId).toEqual(expected.aggregateId);
    expect(lastSavedDomainEvent.aggregateName).toEqual(expected.aggregateName);
    expect(lastSavedDomainEvent.domainEventName).toEqual(expected.domainEventName);
  }
}

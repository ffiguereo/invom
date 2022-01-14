import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DomainEvent } from '../domain/DomainEvent';
import { DomainEventBus } from '../domain/DomainEventBus';
import { DomainEventHandler } from '../domain/DomainEventHandler';

export class DomainEventBusImpl implements DomainEventBus {
  private readonly publisher: Subject<DomainEvent> = new Subject();

  constructor(...handlers: DomainEventHandler[]) {
    this.register(handlers);
  }

  publish(event: DomainEvent): void {
    this.publisher.next(event);
  }

  publishAll(events: Array<DomainEvent> = []): void {
    for (const event of events) {
      this.publisher.next(event);
    }
  }

  protected bind(handler: DomainEventHandler, eventName?: string) {
    const stream$ = eventName ? this.ofEventName(eventName) : this.publisher;
    stream$.subscribe((event) => handler.execute(event));
  }

  protected ofEventName(name: string): Observable<DomainEvent> {
    return this.publisher.pipe(
      filter((event) => event.domainEventName === name),
    );
  }

  protected register(handlers: DomainEventHandler[] = []) {
    for (const handler of handlers) {
      this.registerHandler(handler);
    }
  }

  protected registerHandler(domainEventHandler: DomainEventHandler) {
    if (!domainEventHandler || !(domainEventHandler instanceof DomainEventHandler)) {
      return;
    }

    if (domainEventHandler.events().length === 0) {
      this.bind(domainEventHandler);
    } else {
      for (const Event of domainEventHandler.events()) {
        this.bind(domainEventHandler, Event.name)
      }
    }
  }
}

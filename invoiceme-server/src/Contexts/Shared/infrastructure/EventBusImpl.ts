import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEvent } from '../domain/DomainEvent';
import { EventBus } from '../domain/EventBus';
import { EventHandler } from '../domain/EventHandler';

type Handler = {
  eventsClassNames: Array<string>;
  handlerContainerServiceId: string;
}

export class EventBusImpl implements EventBus {
  private readonly publisher: Subject<DomainEvent> = new Subject;
  private readonly serviceContainer: ContainerBuilder;

  constructor(serviceContainer: ContainerBuilder, handlersId: Handler[] = []) {
    this.serviceContainer = serviceContainer;
    this.register(handlersId);
  }

  publish(event: DomainEvent): void {
    this.publisher.next(event);
  }

  publishAll(events: Array<DomainEvent>): void {
    (events || []).map((event) => this.publisher.next(event));
  }

  protected bind(handler: EventHandler, eventName?: string) {
    const stream$ = eventName ? this.ofEventName(eventName) : this.publisher;
    stream$.subscribe((event) => handler.execute(event));
  }

  protected ofEventName(name: string): Observable<DomainEvent> {
    return this.publisher.pipe(
      filter((event) => event.eventName === name),
    );
  }

  protected register(handlers: Handler[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler.eventsClassNames, handler.handlerContainerServiceId));
  }

  protected registerHandler(eventsClassNames: Array<string>, handlerContainerServiceId: string) {
    const instance = this.serviceContainer.get<EventHandler>(handlerContainerServiceId);
    if (!instance || !(instance instanceof EventHandler)) {
      return;
    }

    if (eventsClassNames.length === 0) {
      this.bind(instance);
    } else {
      for (const event of eventsClassNames) {
        this.bind(instance, event)
      }
    }
  }
}

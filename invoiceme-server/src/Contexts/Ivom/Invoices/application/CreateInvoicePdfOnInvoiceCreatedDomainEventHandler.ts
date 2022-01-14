import { DomainEvent } from "../../../Shared/domain/DomainEvent";
import { DomainEventConstructor, DomainEventHandler } from "../../../Shared/domain/DomainEventHandler";
import { InvoiceCreatedDomainEvent } from "../domain/InvoiceCreatedDomainEvent";

export class CreateInvoicePdfOnInvoiceCreatedDomainEventHandler extends DomainEventHandler {
  events(): DomainEventConstructor<DomainEvent>[] {
    return [
      InvoiceCreatedDomainEvent
    ]
  }

  async doExecute(event: DomainEvent): Promise<void> {
    console.log({
      message: 'CreateInvoicePdfOnInvoiceCreatedEventHandler',
      event
    });
  }
}

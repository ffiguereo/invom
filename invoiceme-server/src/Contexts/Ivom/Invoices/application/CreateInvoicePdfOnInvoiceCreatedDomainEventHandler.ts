import { DomainEvent } from "../../../Shared/domain/DomainEvent";
import { DomainEventConstructor, DomainEventHandler } from "../../../Shared/domain/DomainEventHandler";
import { InvoiceCreatedDomainEvent } from "../domain/InvoiceCreatedDomainEvent";

export class CreateInvoicePdfOnInvoiceCreatedDomainEventHandler extends DomainEventHandler {
  events(): DomainEventConstructor<DomainEvent>[] {
    return [
      InvoiceCreatedDomainEvent
    ]
  }

  async doExecute(_event: DomainEvent): Promise<void> {
    // TODO generate the pdf
  }
}

import { DomainEvent } from "../../../Shared/domain/DomainEvent";
import { EventHandler } from "../../../Shared/domain/EventHandler";

export class CreateInvoicePdfOnInvoiceCreatedEventHandler extends EventHandler {
  async doExecute(event: DomainEvent): Promise<void> {
    console.log({
      message: 'CreateInvoicePdfOnInvoiceCreatedEventHandler',
      event
    });
  }
}

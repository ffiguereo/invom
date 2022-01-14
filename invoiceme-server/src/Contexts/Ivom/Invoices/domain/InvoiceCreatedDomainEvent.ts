import { DomainEvent } from "../../../Shared/domain/DomainEvent";
import { Invoice } from "./Invoice";
import { InvoiceId } from "./InvoiceId";

export class InvoiceCreatedDomainEvent extends DomainEvent {
  constructor(id: InvoiceId) {
    super(id.value, Invoice.name);
  }
}

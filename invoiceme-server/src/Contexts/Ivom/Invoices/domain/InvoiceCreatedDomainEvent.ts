import { DomainEvent } from "../../../Shared/domain/DomainEvent";
import { InvoiceId } from "./InvoiceId";

export class InvoiceCreatedDomainEvent extends DomainEvent {
  constructor(id: InvoiceId) {
    super(id.value);
  }
}

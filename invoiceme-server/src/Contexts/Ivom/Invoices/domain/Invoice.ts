import { AggregateRoot } from "../../../Shared/domain/AggregateRoot";
import { CompanyId } from "../../Shared/domain/Company/CompanyId";
import { InvoiceCreatedDomainEvent } from "./InvoiceCreatedDomainEvent";
import { InvoiceId } from "./InvoiceId";
import { InvoiceNumber } from "./InvoiceNumber";

export class Invoice extends AggregateRoot {
  readonly id: InvoiceId;
  readonly companyId: CompanyId;
  readonly invoiceNumber: InvoiceNumber;

  constructor(id: InvoiceId, companyId: CompanyId, invoiceNumber: InvoiceNumber) {
    super();
    this.id = id;
    this.companyId = companyId;
    this.invoiceNumber = invoiceNumber;
  }

  static create(id: InvoiceId, companyId: CompanyId, invoiceNumber: InvoiceNumber): Invoice {
    const invoice = new Invoice(id, companyId, invoiceNumber);

    invoice.record(new InvoiceCreatedDomainEvent(id));

    return invoice;
  }
}

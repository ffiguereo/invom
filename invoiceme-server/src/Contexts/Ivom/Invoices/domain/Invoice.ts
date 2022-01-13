import { AggregateRoot } from "../../../Shared/domain/AggregateRoot";
import { CompanyId } from "../../Shared/domain/Company/CompanyId";
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
}

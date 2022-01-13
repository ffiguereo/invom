import { Command } from '../../../Shared/domain/Command';

export class CreateInvoiceCommand implements Command {
  readonly id: string;
  readonly companyId: string;
  readonly invoiceNumber: string;

  constructor(id: string, companyId: string, invoiceNumber: string) {
    this.id = id;
    this.companyId = companyId;
    this.invoiceNumber = invoiceNumber;
  }
}

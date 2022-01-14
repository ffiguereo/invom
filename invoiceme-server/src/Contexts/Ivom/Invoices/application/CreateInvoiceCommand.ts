import { Command } from '../../../Shared/domain/Command';

export class CreateInvoiceCommand extends Command {
  readonly id: string;
  readonly companyId: string;
  readonly invoiceNumber: string;

  constructor(id: string, companyId: string, invoiceNumber: string) {
    super();
    this.id = id;
    this.companyId = companyId;
    this.invoiceNumber = invoiceNumber;
  }
}

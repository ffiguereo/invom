import { CommandHandler } from '../../../Shared/domain/CommandHandler';
import { CompanyId } from '../../Shared/domain/Company/CompanyId';
import { Invoice } from '../domain/Invoice';
import { InvoiceId } from '../domain/InvoiceId';
import { InvoiceNumber } from '../domain/InvoiceNumber';
//import { InvoiceRepository } from '../domain/InvoiceRepository';
import { CreateInvoiceCommand } from './CreateInvoiceCommand';

export class CreateInvoiceCommandHandler extends CommandHandler {
  /*private readonly repository: InvoiceRepository;

  constructor(repository: InvoiceRepository) {
    this.repository = repository;
  }*/

  async doExecute(command: CreateInvoiceCommand): Promise<void> {
    const invoice = new Invoice(
      new InvoiceId(command.id),
      new CompanyId(command.companyId),
      new InvoiceNumber(command.invoiceNumber),
    );

    console.log(invoice);

    return Promise.resolve();
    //return this.repository.save(invoice);
  }
}

import { CommandConstructor, CommandHandler } from '../../../Shared/domain/CommandHandler';
import { DomainEventBus } from '../../../Shared/domain/DomainEventBus';
import { CompanyId } from '../../Shared/domain/Company/CompanyId';
import { Invoice } from '../domain/Invoice';
import { InvoiceId } from '../domain/InvoiceId';
import { InvoiceNumber } from '../domain/InvoiceNumber';
//import { InvoiceRepository } from '../domain/InvoiceRepository';
import { CreateInvoiceCommand } from './CreateInvoiceCommand';
export class CreateInvoiceCommandHandler extends CommandHandler {
  private readonly domainEventBus: DomainEventBus;

  constructor(domainEventBus: DomainEventBus) {
    super();
    this.domainEventBus = domainEventBus;
  }

  async doExecute(command: CreateInvoiceCommand): Promise<void> {
    const invoice = Invoice.create(
      new InvoiceId(command.id),
      new CompanyId(command.companyId),
      new InvoiceNumber(command.invoiceNumber)
    );

    this.domainEventBus.publishAll(invoice.pullDomainEvents());

    return Promise.resolve();
  }

  command(): CommandConstructor<CreateInvoiceCommand>{
    return CreateInvoiceCommand;
  }
}

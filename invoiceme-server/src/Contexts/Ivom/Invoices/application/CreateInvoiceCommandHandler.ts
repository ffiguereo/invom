import { CommandHandler } from '../../../Shared/domain/CommandHandler';
import { EventBus } from '../../../Shared/domain/EventBus';
import { CompanyId } from '../../Shared/domain/Company/CompanyId';
import { Invoice } from '../domain/Invoice';
import { InvoiceId } from '../domain/InvoiceId';
import { InvoiceNumber } from '../domain/InvoiceNumber';
//import { InvoiceRepository } from '../domain/InvoiceRepository';
import { CreateInvoiceCommand } from './CreateInvoiceCommand';

export class CreateInvoiceCommandHandler extends CommandHandler {
  private readonly eventBus: EventBus;

  constructor(eventBus: EventBus) {
    super();
    this.eventBus = eventBus;
  }

  async doExecute(command: CreateInvoiceCommand): Promise<void> {
    const invoice = Invoice.create(
      new InvoiceId(command.id),
      new CompanyId(command.companyId),
      new InvoiceNumber(command.invoiceNumber),
    );

    this.eventBus.publishAll(invoice.pullDomainEvents());

    return Promise.resolve();
  }
}

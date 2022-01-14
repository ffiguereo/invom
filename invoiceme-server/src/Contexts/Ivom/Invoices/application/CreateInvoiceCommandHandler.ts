import { CommandConstructor, CommandHandler } from '../../../Shared/domain/CommandHandler';
import { DomainEventBus } from '../../../Shared/domain/DomainEventBus';
import { CompanyId } from '../../Shared/domain/Company/CompanyId';
import { Invoice } from '../domain/Invoice';
import { InvoiceId } from '../domain/InvoiceId';
import { InvoiceNumber } from '../domain/InvoiceNumber';
import { InvoiceRepository } from '../domain/InvoiceRepository';
import { CreateInvoiceCommand } from './CreateInvoiceCommand';
export class CreateInvoiceCommandHandler extends CommandHandler {
  private readonly domainEventBus: DomainEventBus;
  private readonly invoiceRepository: InvoiceRepository

  constructor(domainEventBus: DomainEventBus, invoiceRepository: InvoiceRepository) {
    super();
    this.domainEventBus = domainEventBus;
    this.invoiceRepository = invoiceRepository;
  }

  async doExecute(command: CreateInvoiceCommand): Promise<void> {
    const invoice = Invoice.create(
      new InvoiceId(command.id),
      new CompanyId(command.companyId),
      new InvoiceNumber(command.invoiceNumber)
    );

    await this.invoiceRepository.save(invoice);

    this.domainEventBus.publishAll(invoice.pullDomainEvents());

    return Promise.resolve();
  }

  command(): CommandConstructor<CreateInvoiceCommand>{
    return CreateInvoiceCommand;
  }
}

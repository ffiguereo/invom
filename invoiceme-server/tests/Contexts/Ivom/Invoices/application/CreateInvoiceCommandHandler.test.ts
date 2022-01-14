import { CreateInvoiceCommand } from '../../../../../src/Contexts/Ivom/Invoices/application/CreateInvoiceCommand';
import { CreateInvoiceCommandHandler } from '../../../../../src/Contexts/Ivom/Invoices/application/CreateInvoiceCommandHandler';
import { Invoice } from '../../../../../src/Contexts/Ivom/Invoices/domain/Invoice';
import { InvoiceCreatedDomainEvent } from '../../../../../src/Contexts/Ivom/Invoices/domain/InvoiceCreatedDomainEvent';
import { InvoiceNumber } from '../../../../../src/Contexts/Ivom/Invoices/domain/InvoiceNumber';
import { Uuid } from '../../../../../src/Contexts/Shared/domain/value-object/Uuid';
import { DomainEventBusMock } from '../../../Shared/__mocks__/DomainEventBusMock';
import { InMemoryInvoiceRepository } from '../../../../../src/Contexts/Ivom/Invoices/infrastructure/persistence/InMemoryInvoiceRepository';

let domainEventBus: DomainEventBusMock;
let repository: InMemoryInvoiceRepository;
let commandHandler: CreateInvoiceCommandHandler;

beforeEach(() => {
  domainEventBus = new DomainEventBusMock();
  repository = new InMemoryInvoiceRepository();
  commandHandler = new CreateInvoiceCommandHandler(domainEventBus, repository);
});

describe('CreateInvoiceCommandHandler', () => {
  it('should create a valid invoice', async () => {
    const id = Uuid.random();
    const companyId = Uuid.random();
    const invoiceNumber = new InvoiceNumber('INV-3456');

    const command: CreateInvoiceCommand = new CreateInvoiceCommand(id.value, companyId.value, invoiceNumber.value);

    const invoice = new Invoice(id, companyId, invoiceNumber);

    await commandHandler.execute(command);

    expect(await repository.search(id)).toEqual(invoice);

    domainEventBus.assertLastSavedEventIs(new InvoiceCreatedDomainEvent(id));
  });
});

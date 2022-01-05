import { InvoiceCreator } from '../../../../../src/Contexts/Ivom/Invoices/application/InvoiceCreator';
import { Invoice } from '../../../../../src/Contexts/Ivom/Invoices/domain/Invoice';
import { InvoiceRepositoryMock } from '../__mocks__/InvoiceRepositoryMock';

let repository: InvoiceRepositoryMock;
let creator: InvoiceCreator;

beforeEach(() => {
  repository = new InvoiceRepositoryMock();
  creator = new InvoiceCreator(repository);
});

describe('InvoiceCreator', () => {
  it('should create a valid invoice', async () => {

    const id = 'some-id';
    const name = 'some-name';
    const duration = 'some-duration';

    const invoice = new Invoice({id, name, duration});

    await creator.run(id, name, duration);

    repository.assertLastSavedInvoiceIs(invoice);
  });
});

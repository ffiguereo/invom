import { InvoiceRepository } from '../../../../../src/Contexts/Ivom/Invoices/domain/InvoiceRepository';
import { Invoice } from '../../../../../src/Contexts/Ivom/Invoices/domain/Invoice';

export class InvoiceRepositoryMock implements InvoiceRepository {
  private mockSave = jest.fn();

  async save(invoice: Invoice): Promise<void> {
    this.mockSave(invoice);
  }

  assertLastSavedInvoiceIs(expected: Invoice): void {
    const mock = this.mockSave.mock;
    const lastSavedInvoice = mock.calls[mock.calls.length - 1][0] as Invoice;
    expect(lastSavedInvoice).toBeInstanceOf(Invoice);
    expect(lastSavedInvoice.id).toEqual(expected.id);
  }

}

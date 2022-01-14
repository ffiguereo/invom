import { Nullable } from "../../../../Shared/domain/Nullable";
import { Invoice } from "../../domain/Invoice";
import { InvoiceId } from "../../domain/InvoiceId";
import { InvoiceRepository } from "../../domain/InvoiceRepository";

export class InMemoryInvoiceRepository implements InvoiceRepository {
  private invoices: Map<string, Invoice> = new Map();

  async save(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id.value, invoice);

    return Promise.resolve();
  }

  async search(id: InvoiceId): Promise<Nullable<Invoice>> {
    return Promise.resolve(this.invoices.get(id.value) || null);
  }
}

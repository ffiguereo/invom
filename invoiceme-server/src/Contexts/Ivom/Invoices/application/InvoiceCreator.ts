import { Invoice } from '../domain/Invoice';
import { InvoiceRepository } from '../domain/InvoiceRepository';

export class InvoiceCreator {
  private repository: InvoiceRepository;

  constructor(repository: InvoiceRepository) {
    this.repository = repository;
  }

  async run(id: string, name: string, duration: string): Promise<void> {
    const invoice = new Invoice({ id, name, duration });

    return this.repository.save(invoice);
  }
}

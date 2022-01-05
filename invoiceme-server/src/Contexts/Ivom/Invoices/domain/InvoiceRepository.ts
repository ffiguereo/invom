import { Invoice } from './Invoice';

export interface InvoiceRepository {
  save(course: Invoice): Promise<void>;
}

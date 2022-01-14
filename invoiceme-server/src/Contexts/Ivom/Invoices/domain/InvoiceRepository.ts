import { Nullable } from '../../../Shared/domain/Nullable';
import { Invoice } from './Invoice';
import { InvoiceId } from './InvoiceId';

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;

  search(id: InvoiceId): Promise<Nullable<Invoice>>;
}

import { AggregateRoot } from "../../../Shared/domain/AggregateRoot";
import { InvoiceId } from "./InvoiceId";

export class InvoiceItem extends AggregateRoot {
  readonly id: InvoiceId;

  constructor(
    id: InvoiceId,
  ) {
    super();
    this.id = id;

    // TODO InvoiceItem
  }
}

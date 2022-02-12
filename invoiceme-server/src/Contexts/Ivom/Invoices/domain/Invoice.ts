import { AggregateRoot } from "../../../Shared/domain/AggregateRoot";
import { CompanyId } from "../../Shared/domain/Company/CompanyId";
import { CurrencyId } from "../../Shared/domain/Currency/CurrencyId";
import { CustomerId } from "../../Shared/domain/Customer/CustomerId";
import { InvoiceCreatedDomainEvent } from "./InvoiceCreatedDomainEvent";
import { InvoiceId } from "./InvoiceId";
import { InvoiceItem } from "./InvoiceItem";
import { InvoiceNumber } from "./InvoiceNumber";

export class Invoice extends AggregateRoot {
  private readonly _id: InvoiceId;
  private readonly _companyId: CompanyId;
  private readonly _customerId: CustomerId;
  private readonly _invoiceNumber: InvoiceNumber;
  private readonly _currencyId: CurrencyId;
  private readonly _items: Map<string, InvoiceItem>;

  constructor(
    id: InvoiceId,
    customerId: CustomerId,
    companyId: CompanyId,
    invoiceNumber: InvoiceNumber,
    currencyId: CurrencyId,
    items: Map<string, InvoiceItem> = new Map(),
  ) {
    super();
    this._id = id;
    this._customerId = customerId;
    this._companyId = companyId;
    this._invoiceNumber = invoiceNumber;
    this._currencyId = currencyId;
    this._items = items;
  }

  static create(
    id: InvoiceId,
    customerId: CustomerId,
    companyId: CompanyId,
    invoiceNumber: InvoiceNumber,
    currencyId: CurrencyId,
  ): Invoice {
    const invoice = new Invoice(id, customerId, companyId, invoiceNumber, currencyId);

    invoice.record(new InvoiceCreatedDomainEvent(id));

    return invoice;
  }

  get id(): InvoiceId {
    return this._id;
  }

  get companyId(): CompanyId {
    return this._companyId;
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get invoiceNumber(): InvoiceNumber {
    return this._invoiceNumber;
  }

  get currencyId(): CurrencyId {
    return this._currencyId;
  }

  get items(): Array<InvoiceItem> {
    return Array.from(this._items.values());
  }
}

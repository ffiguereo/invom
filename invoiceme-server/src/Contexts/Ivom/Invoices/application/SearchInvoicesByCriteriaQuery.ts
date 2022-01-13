import { Query } from '../../../Shared/domain/Query';

export class SearchInvoicesByCriteriaQuery implements Query {
  readonly filters: Array<Map<string, string>>;
  readonly orderBy: string | null;
  readonly orderType: string | null;
  readonly limit: number | null;
  readonly offset: number | null;

  constructor(
    filters: Array<Map<string, string>>,
    orderBy: string | null = null,
    orderType: string | null = null,
    limit: number | null = null,
    offset: number | null = null
  ) {
    this.filters = filters;
    this.orderBy = orderBy;
    this.orderType = orderType;
    this.limit = limit;
    this.offset = offset;
  }
}

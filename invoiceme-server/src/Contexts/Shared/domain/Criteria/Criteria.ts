import { Nullable } from '../Nullable';
import { CriteriaLimit } from './CriteriaLimit';
import { CriteriaOffset } from './CriteriaOffset';
import { Filters } from './Filters';
import { Order } from './Order';

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly offset: Nullable<CriteriaOffset>;
  readonly limit: Nullable<CriteriaLimit>;

  constructor(
    filters: Filters,
    order: Order,
    offset: Nullable<CriteriaOffset> = null,
    limit: Nullable<CriteriaLimit> = null
  ) {
    this.filters = filters;
    this.order = order;
    this.offset = offset;
    this.limit = limit;
  }

  hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }
}

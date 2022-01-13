import { Criteria } from '../../../Shared/domain/Criteria/Criteria';
import { CriteriaLimit } from '../../../Shared/domain/Criteria/CriteriaLimit';
import { CriteriaOffset } from '../../../Shared/domain/Criteria/CriteriaOffset';
import { Filters } from '../../../Shared/domain/Criteria/Filters';
import { Order } from '../../../Shared/domain/Criteria/Order';
import { QueryHandler } from '../../../Shared/domain/QueryHandler';
import { QueryResponse } from '../../../Shared/domain/QueryResponse';
import { SearchInvoicesByCriteriaQuery } from './SearchInvoicesByCriteriaQuery';

export class SearchInvoicesByCriteriaQueryHandler extends QueryHandler {
  async doExecute(query: SearchInvoicesByCriteriaQuery): Promise<void | QueryResponse> {
    const filters = Filters.fromValues(query.filters);
    const order   = Order.fromValues(query.orderBy, query.orderType);
    const offset   = query.offset ? new CriteriaOffset(query.offset) : null;
    const limit   = query.limit ? new CriteriaLimit(query.limit) : null;
    const criteria = new Criteria(filters, order, offset, limit);

    console.log(criteria);

    return Promise.resolve();
  }
}

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SearchInvoicesByCriteriaQuery } from '../../../../Contexts/Ivom/Invoices/application/SearchInvoicesByCriteriaQuery';
import { QueryBus } from '../../../../Contexts/Shared/domain/QueryBus';
import { Controller } from './Controller';

export class InvoicesGetController implements Controller {
  private readonly queryBus: QueryBus;

  constructor(queryBus: QueryBus) {
    this.queryBus = queryBus;
  }

  async run(req: Request, res: Response) {
    const filters: Array<Map<string, string>> = [];
    const invoiceNumberFilter = new Map();
    invoiceNumberFilter.set('field', 'invoiceNumber');
    invoiceNumberFilter.set('operator', 'CONTAINS');
    invoiceNumberFilter.set('value', '24');

    filters.push(
      invoiceNumberFilter
    );

    await this.queryBus.dispatch(new SearchInvoicesByCriteriaQuery(
      filters,
      'invoiceNumber',
      'DESC',
      50,
      1,
    ));
    res.status(httpStatus.OK).send();
  }
}

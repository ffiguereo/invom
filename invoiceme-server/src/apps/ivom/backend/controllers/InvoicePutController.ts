import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateInvoiceCommand } from '../../../../Contexts/Ivom/Invoices/application/CreateInvoiceCommand';
import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { Controller } from './Controller';

type InvoicePutRequest = Request & {
  body: {
    id: string;
    companyId: string;
    invoiceNumber: string;
  };
};
export class InvoicePutController implements Controller {
  private readonly commandBus: CommandBus;

  constructor(commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  async run(req: InvoicePutRequest, res: Response) {
    const { id, companyId, invoiceNumber } = req.body;

    await this.commandBus.dispatch(new CreateInvoiceCommand(id, companyId, invoiceNumber));

    res.status(httpStatus.CREATED).send();
  }
}

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateInvoiceCommand } from '../../../../Contexts/Ivom/Invoices/application/CreateInvoiceCommand';
import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { Uuid } from '../../../../Contexts/Shared/domain/value-object/Uuid';
import { Controller } from './Controller';

export class InvoicePutController implements Controller {
  private readonly commandBus: CommandBus;

  constructor(commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  async run(req: Request, res: Response) {
    await this.commandBus.dispatch(new CreateInvoiceCommand(
      Uuid.random().value,
      Uuid.random().value,
      'IV-3456'
    ));
    res.status(httpStatus.CREATED).send();
  }
}

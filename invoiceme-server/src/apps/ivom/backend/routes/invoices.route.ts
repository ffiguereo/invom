import { Router, Request, Response } from 'express';
import container from '../dependency-injection';

export const register = (router: Router) => {
  const invoicesGetController = container.get('Apps.ivom.controllers.InvoicesGetController');
  router.get('/invoices', (req: Request, res: Response) => invoicesGetController.run(req, res));

  const invoicePutController = container.get('Apps.ivom.controllers.InvoicePutController');
  router.put('/invoices/:id', (req: Request, res: Response) => invoicePutController.run(req, res));
};

import { useMemo } from 'react';

import { Button } from '../../components/button';
import { Dialog, useDialogues } from '../../context/dialogues-context';
import { InvoiceItemsTable } from './components';
import { useInvoiceStore } from './stores';

export function InvoiceItems() {
  const { open } = useDialogues();
  const invoiceState = useInvoiceStore((state) => state.invoice);
  const isNewInvoice = useMemo(() => !invoiceState, [invoiceState]);

  return (
    <div className="bg-white shadow rounded-md">
      <header>
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Items</h1>
          <Button
            disabled={isNewInvoice}
            onClick={() =>
              open(Dialog.InvoiceItem, {
                invoiceId: invoiceState?._id,
              })
            }
          >
            New Item
          </Button>
        </div>
      </header>

      <div>
        <InvoiceItemsTable invoiceId={invoiceState?._id} items={invoiceState?.items} />
      </div>
    </div>
  );
}

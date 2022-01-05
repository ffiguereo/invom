import { useMemo } from 'react';

import { Button } from '../../components/button';
import { Dialog, useDialogues } from '../../context/dialogues-context';
import { InvoicePaymentsTable } from './components';
import { useInvoiceStore } from './stores';

export function InvoicePayments() {
  const { open } = useDialogues();
  const invoiceState = useInvoiceStore((state) => state.invoice);
  const isNewInvoice = useMemo(() => !invoiceState, [invoiceState]);
  const pendingToPay = useMemo(() => (invoiceState ? invoiceState.balance : 0), [invoiceState]);
  const isDisableCreatePayment = useMemo(() => {
    if (isNewInvoice) {
      return true;
    }

    if (pendingToPay <= 0) {
      return true;
    }

    return false;
  }, [isNewInvoice, pendingToPay]);

  return (
    <div className="bg-white shadow rounded-md">
      <header>
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Payments</h1>
          <Button
            disabled={isDisableCreatePayment}
            onClick={() =>
              open(Dialog.InvoicePayment, {
                invoiceId: invoiceState?._id,
                pendingToPay,
              })
            }
          >
            New payment
          </Button>
        </div>
      </header>

      <div>
        <InvoicePaymentsTable invoiceId={invoiceState?._id} payments={invoiceState?.paymentRecords} />
      </div>
    </div>
  );
}

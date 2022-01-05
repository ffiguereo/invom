import { useMemo } from 'react';

import { Table } from '../../../components/table';
import { Dialog, useDialogues } from '../../../context/dialogues-context';

export function InvoicePaymentsTable({ invoiceId, payments = [] }) {
  const { open } = useDialogues();

  const columns = useMemo(
    () => [
      {
        Header: 'Date Paid',
        id: 'datePaid',
        Cell: ({ row: { original } }) => {
          return new Intl.DateTimeFormat().format(new Date(original?.datePaid));
        },
      },
      {
        Header: 'Amount Paid',
        accessor: 'amountPaid',
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ row: { original } }) => {
          return (
            <>
              <button
                type="button"
                onClick={() => open(Dialog.InvoicePayment, { invoiceId, paymentId: original._id, payment: original })}
              >
                Edit
              </button>
              <button
                type="button"
                className="ml-2 text-red-600"
                onClick={() => open(Dialog.InvoicePaymentRemove, { invoiceId, paymentId: original._id })}
              >
                Delete
              </button>
            </>
          );
        },
      },
    ],
    [invoiceId, open],
  );

  return <Table columns={columns} data={payments} />;
}

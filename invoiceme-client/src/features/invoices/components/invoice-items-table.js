import { useMemo } from 'react';

import { Table } from '../../../components/table';
import { Dialog, useDialogues } from '../../../context/dialogues-context';

export function InvoiceItemsTable({ invoiceId, items = [] }) {
  const { open } = useDialogues();

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Qty',
        accessor: 'quantity',
      },
      {
        Header: 'price',
        accessor: 'unitPrice',
      },
      {
        Header: 'Disc(%)',
        accessor: 'discount',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ row: { original } }) => {
          return (
            <>
              <button
                type="button"
                onClick={() => open(Dialog.InvoiceItem, { invoiceId, itemId: original._id, item: original })}
              >
                Edit
              </button>
              <button
                type="button"
                className="ml-2 text-red-600"
                onClick={() => open(Dialog.InvoiceItemRemove, { invoiceId, itemId: original._id })}
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

  return <Table columns={columns} data={items} />;
}

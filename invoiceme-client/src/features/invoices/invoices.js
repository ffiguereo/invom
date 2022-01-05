import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../components/button';
import { Table } from '../../components/table';
import { Dialog, useDialogues } from '../../context/dialogues-context';
import { useInvoicesQuery } from '../../libs/react-query';

function InvoiceStatus({ status }) {
  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      {status}
    </span>
  );
}

export function Invoices() {
  const { open } = useDialogues();
  const { data: invoices = [] } = useInvoicesQuery();
  const navigate = useNavigate();

  const handleDeleteInvoice = useCallback(
    (invoiceId) => {
      open(Dialog.InvoiceRemove, { invoiceId });
    },
    [open],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Nº',
        accessor: 'invoiceNumber',
      },
      {
        Header: 'Client',
        id: 'client',
        Cell: ({ row: { original } }) => {
          return `${original?.client?.lastName} ${original?.client?.firstName}`;
        },
      },
      {
        Header: 'Amount',
        id: 'amount',
        Cell: ({ row: { original } }) => {
          return `${original.currency} ${original.total}`;
        },
      },
      {
        Header: 'Due date',
        id: 'dueDate',
        Cell: ({ row: { original } }) => {
          return new Intl.DateTimeFormat().format(new Date(original?.dueDate));
        },
      },
      {
        Header: 'State',
        Cell: ({ row: { original } }) => {
          return <InvoiceStatus status={original.status} />;
        },
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ row: { original } }) => {
          return (
            <>
              <Link to={original._id}>Edit</Link>
              <button type="button" className="ml-2 text-red-600" onClick={() => handleDeleteInvoice(original._id)}>
                Delete
              </button>
            </>
          );
        },
      },
    ],
    [handleDeleteInvoice],
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
      <div className="bg-white shadow rounded">
        <header>
          <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Invoices</h1>
            <Button onClick={() => navigate('/invoices/new')}>New Invoice</Button>
          </div>
        </header>

        <div>
          <Table columns={columns} data={invoices} />
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../components/button';
import { Table } from '../../components/table';
import { Dialog, useDialogues } from '../../context/dialogues-context';
import { useClientsQuery } from '../../libs/react-query';

export function Clients() {
  const navigate = useNavigate();
  const { open } = useDialogues();
  const { data: clients = [] } = useClientsQuery();

  const columns = useMemo(
    () => [
      {
        Header: 'Full name',
        id: 'fullName',
        Cell: ({ row: { original } }) => {
          return `${original.lastName} ${original.firstName}`;
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ row: { original } }) => {
          return (
            <>
              <Link to={original._id}>Edit</Link>
              <button
                type="button"
                className="ml-2 text-red-600"
                onClick={() => open(Dialog.ClientRemove, { clientId: original._id })}
              >
                Delete
              </button>
            </>
          );
        },
      },
    ],
    [open],
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
      <div className="bg-white shadow rounded">
        <header>
          <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Clients</h1>
            <Button onClick={() => navigate('/clients/new')}>New Client</Button>
          </div>
        </header>

        <div>
          <Table columns={columns} data={clients} />
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';

import { Table } from '../../../components/table';
import { Dialog, useDialogues } from '../../../context/dialogues-context';

export function ClientAddressTable({ clientId, addresses = [] }) {
  const { open } = useDialogues();

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'DNI / NIE / NIF',
        accessor: 'idNumber',
      },
      {
        Header: 'phone',
        accessor: 'phone',
      },
      {
        Header: 'Address',
        id: 'address',
        Cell: ({ row: { original } }) => {
          return (
            <p className="truncate">
              {original.address}, {original?.addressExtra}
            </p>
          );
        },
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ row: { original } }) => {
          return (
            <>
              <button
                type="button"
                onClick={() => open(Dialog.ClientAddress, { clientId, addressId: original._id, address: original })}
              >
                Edit
              </button>
              <button
                type="button"
                className="ml-2 text-red-600"
                onClick={() => open(Dialog.ClientAddressRemove, { clientId, addressId: original._id })}
              >
                Delete
              </button>
            </>
          );
        },
      },
    ],
    [open, clientId],
  );

  return <Table columns={columns} data={addresses} />;
}

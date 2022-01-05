import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '../../components/button';
import { Dialog, useDialogues } from '../../context/dialogues-context';
import { useClientQuery } from '../../libs/react-query';
import { ClientAddressTable } from './components';

export function ClientAddress() {
  const { clientId } = useParams();
  const { open } = useDialogues();
  const isNewClient = useMemo(() => clientId === 'new', [clientId]);
  const { isLoading, data: client } = useClientQuery({ clientId, options: { enabled: !isNewClient } });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="bg-white shadow rounded-md">
      <header>
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Address</h1>
          <Button
            disabled={isNewClient}
            onClick={() =>
              open(Dialog.ClientAddress, {
                clientId,
              })
            }
          >
            New Address
          </Button>
        </div>
      </header>

      <div>
        <ClientAddressTable clientId={clientId} addresses={client?.address} />
      </div>
    </div>
  );
}

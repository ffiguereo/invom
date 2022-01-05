import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog';
import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from 'react-query';

import { Button } from '../../../components/button';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import { QUERY_KEYS, useRemoveClientAddressMutation } from '../../../libs/react-query';

export function ClientAddressRemoveAlertDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const show = useMemo(() => isOpen(DialogEnum.ClientAddressRemove), [isOpen]);
  const cancelRef = useRef();
  const queryClient = useQueryClient();

  const removeClientAddressMutation = useRemoveClientAddressMutation();

  const handleDeleteClientAddress = useCallback(async () => {
    await removeClientAddressMutation.mutateAsync({
      clientId: showDialog?.data?.clientId,
      addressId: showDialog?.data?.addressId,
    });
    queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENT_QUERY, showDialog?.data?.clientId]);
    close();
  }, [showDialog, removeClientAddressMutation, queryClient, close]);

  return (
    <AlertDialog isOpen={show} className="rounded" leastDestructiveRef={cancelRef}>
      <AlertDialogLabel className="font-bold text-primary text-lg">Please Confirm!</AlertDialogLabel>

      <AlertDialogDescription className="text-gray-700 text-base mt-4">
        Are you sure you want to delete something? This action is permanent, and we are totally not just flipping a
        field called deleted to true in our database, we are actually deleting something.
      </AlertDialogDescription>

      <div className="mt-8 flex">
        <Button type="button" color="danger" className="mr-2" onClick={() => handleDeleteClientAddress()}>
          Yes, delete
        </Button>

        <Button type="button" ref={cancelRef} onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </AlertDialog>
  );
}

import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog';
import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from 'react-query';

import { Button } from '../../../components/button';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import { QUERY_KEYS, useRemoveClientMutation } from '../../../libs/react-query';

export function ClientRemoveAlertDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const show = useMemo(() => isOpen(DialogEnum.ClientRemove), [isOpen]);
  const cancelRef = useRef();
  const queryClient = useQueryClient();

  const removeClientMutation = useRemoveClientMutation();

  const handleDeleteClient = useCallback(async () => {
    await removeClientMutation.mutateAsync({ clientId: showDialog?.data?.clientId });
    queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENTS_QUERY]);
    close();
  }, [showDialog, removeClientMutation, queryClient, close]);

  return (
    <AlertDialog isOpen={show} className="rounded" leastDestructiveRef={cancelRef}>
      <AlertDialogLabel className="font-bold text-primary text-lg">Please Confirm!</AlertDialogLabel>

      <AlertDialogDescription className="text-gray-700 text-base mt-4">
        Are you sure you want to delete something? This action is permanent, and we are totally not just flipping a
        field called deleted to true in our database, we are actually deleting something.
      </AlertDialogDescription>

      <div className="mt-8 flex">
        <Button type="button" color="danger" className="mr-2" onClick={() => handleDeleteClient()}>
          Yes, delete
        </Button>

        <Button type="button" ref={cancelRef} onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </AlertDialog>
  );
}

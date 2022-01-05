import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog';
import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from 'react-query';

import { Button } from '../../../components/button';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import { QUERY_KEYS, useRemoveInvoiceItemMutation } from '../../../libs/react-query';

export function InvoiceItemRemoveAlertDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const show = useMemo(() => isOpen(DialogEnum.InvoiceItemRemove), [isOpen]);
  const cancelRef = useRef();
  const queryClient = useQueryClient();
  const removeInvoiceItemMutation = useRemoveInvoiceItemMutation();

  const handleDeleteInvoiceItem = useCallback(async () => {
    await removeInvoiceItemMutation.mutateAsync({
      invoiceId: showDialog?.data?.invoiceId,
      itemId: showDialog?.data?.itemId,
    });
    queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog?.data?.invoiceId]);
    close();
  }, [showDialog, queryClient, removeInvoiceItemMutation, close]);

  return (
    <AlertDialog isOpen={show} className="rounded" leastDestructiveRef={cancelRef}>
      <AlertDialogLabel className="font-bold text-primary text-lg">Please Confirm!</AlertDialogLabel>

      <AlertDialogDescription className="text-gray-700 text-base mt-4">
        Are you sure you want to delete something? This action is permanent, and we are totally not just flipping a
        field called deleted to true in our database, we are actually deleting something.
      </AlertDialogDescription>

      <div className="mt-8 flex">
        <Button type="button" color="danger" className="mr-2" onClick={() => handleDeleteInvoiceItem()}>
          Yes, delete
        </Button>

        <Button type="button" ref={cancelRef} onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </AlertDialog>
  );
}

import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog';
import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from 'react-query';

import { Button } from '../../../components/button';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import { QUERY_KEYS, useRemoveInvoicePaymentMutation } from '../../../libs/react-query';

export function InvoicePaymentRemoveAlertDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const show = useMemo(() => isOpen(DialogEnum.InvoicePaymentRemove), [isOpen]);
  const cancelRef = useRef();
  const queryClient = useQueryClient();
  const removeInvoicePaymentMutation = useRemoveInvoicePaymentMutation();

  const handleDeleteInvoicePayment = useCallback(async () => {
    await removeInvoicePaymentMutation.mutateAsync({
      invoiceId: showDialog?.data?.invoiceId,
      paymentId: showDialog?.data?.paymentId,
    });
    queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog?.data?.invoiceId]);
    close();
  }, [showDialog, queryClient, removeInvoicePaymentMutation, close]);

  return (
    <AlertDialog isOpen={show} className="rounded" leastDestructiveRef={cancelRef}>
      <AlertDialogLabel className="font-bold text-primary text-lg">Please Confirm!</AlertDialogLabel>

      <AlertDialogDescription className="text-gray-700 text-base mt-4">
        Are you sure you want to delete something? This action is permanent, and we are totally not just flipping a
        field called deleted to true in our database, we are actually deleting something.
      </AlertDialogDescription>

      <div className="mt-8 flex">
        <Button type="button" color="danger" className="mr-2" onClick={() => handleDeleteInvoicePayment()}>
          Yes, delete
        </Button>

        <Button type="button" ref={cancelRef} onClick={() => close()}>
          Cancel
        </Button>
      </div>
    </AlertDialog>
  );
}

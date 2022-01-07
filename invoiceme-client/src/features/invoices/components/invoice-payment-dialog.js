import '@reach/dialog/styles.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { Button } from '../../../components/button';
import { FormField, FormSelectField, FormTextareaField } from '../../../components/form';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import {
  QUERY_KEYS,
  useCreateInvoicePaymentMutation,
  useUpdateInvoicePaymentMutation,
} from '../../../libs/react-query';

export const invoicePaymentSchemaValidation = yup
  .object({
    amountPaid: yup.number().positive().required(),
    datePaid: yup.date().required(),
    paymentMethod: yup.string().required(),
    note: yup.string(),
  })
  .required();

const paymentMethods = [
  { value: 'Bank Transfer' },
  { value: 'Cash' },
  { value: 'Credit Card' },
  { value: 'PayPal' },
  { value: 'Others' },
];

export function InvoicePaymentDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const queryClient = useQueryClient();
  const isNewPayment = useMemo(() => !showDialog?.data?.paymentId || !showDialog?.data?.payment, [showDialog]);
  const show = useMemo(() => isOpen(DialogEnum.InvoicePayment), [isOpen]);
  const createInvoicePaymentMutation = useCreateInvoicePaymentMutation();
  const updateInvoicePaymentMutation = useUpdateInvoicePaymentMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(invoicePaymentSchemaValidation),
  });

  useEffect(() => {
    if (!showDialog?.data?.payment) {
      reset({
        amountPaid: showDialog?.data?.pendingToPay,
      });
    } else {
      reset({
        amountPaid: showDialog.data.payment.amountPaid,
        datePaid: showDialog.data.payment.datePaid,
        paymentMethod: showDialog.data.payment.paymentMethod,
        note: showDialog.data.payment.note,
      });
    }
  }, [showDialog, reset]);

  const onSubmit = useCallback(
    async (data) => {
      const payment = {
        amountPaid: data.amountPaid,
        datePaid: data.datePaid,
        paymentMethod: data.paymentMethod,
        note: data.note,
      };

      if (isNewPayment) {
        createInvoicePaymentMutation.mutateAsync({ invoiceId: showDialog.data.invoiceId, payment }).then(() => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog.data.invoiceId]);
          close();
        });
      } else {
        updateInvoicePaymentMutation
          .mutateAsync({
            invoiceId: showDialog.data.invoiceId,
            paymentId: showDialog.data.paymentId,
            payment,
          })
          .then(() => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog.data.invoiceId]);
            close();
          });
      }
    },
    [isNewPayment, showDialog, close, queryClient, updateInvoicePaymentMutation, createInvoicePaymentMutation],
  );

  return (
    <Dialog aria-label="invoice payment dialog" className="rounded relative" isOpen={show} onDismiss={() => close()}>
      <div style={{ top: '10px', right: '15px' }} className="absolute">
        <button className="outline-none focus:outline-none" onClick={() => close()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden className="uppercase">
            ×
          </span>
        </button>
      </div>
      <div className="relative pb-2 border-b border-gray-300">
        <h2 className="font-bold text-primary text-lg">Payment</h2>
      </div>
      <div className="text-gray-700 text-base mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-3">
              <FormField
                type="date"
                placeholder="Date Paid"
                label="Date Paid"
                {...register('datePaid')}
                error={errors?.datePaid}
              />
            </div>

            <div className="col-span-3">
              <FormField
                type="number"
                step="0.01"
                placeholder="Amount Paid"
                label="Amount Paid"
                {...register('amountPaid')}
                error={errors?.amountPaid}
              />
            </div>

            <div className="col-span-3">
              <FormSelectField label="Payment method" {...register('paymentMethod')} error={errors?.paymentMethod}>
                <option value="">Select a payment method...</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.value}
                  </option>
                ))}
              </FormSelectField>
            </div>

            <div className="col-span-6">
              <FormTextareaField label="Notes" {...register('note')} error={errors?.note} />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit">{isNewPayment ? 'Create' : 'Edit'}</Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

import '@reach/dialog/styles.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { Button } from '../../../components/button';
import { FormField } from '../../../components/form';
import { Dialog as DialogEnum, useDialogues } from '../../../context/dialogues-context';
import { QUERY_KEYS, useCreateInvoiceItemMutation, useUpdateInvoiceItemMutation } from '../../../libs/react-query';

export const invoiceItemSchemaValidation = yup
  .object({
    name: yup.string().required(),
    quantity: yup.number().positive().min(1).required(),
    unitPrice: yup.number().positive().min(0).required(),
    discount: yup.number().positive().min(0),
  })
  .required();

export function InvoiceItemDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const queryClient = useQueryClient();
  const isNewItem = useMemo(() => !showDialog?.data?.itemId || !showDialog?.data?.item, [showDialog]);
  const show = useMemo(() => isOpen(DialogEnum.InvoiceItem), [isOpen]);
  const createInvoiceItemMutation = useCreateInvoiceItemMutation();
  const updateInvoiceItemMutation = useUpdateInvoiceItemMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(invoiceItemSchemaValidation),
  });

  useEffect(() => {
    if (!showDialog?.data?.item) {
      reset({
        name: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
      });
    } else {
      reset({
        name: showDialog.data.item.name,
        quantity: showDialog.data.item.quantity,
        unitPrice: showDialog.data.item.unitPrice,
        discount: showDialog.data.item.discount,
      });
    }
  }, [showDialog, reset]);

  const onSubmit = useCallback(
    async (data) => {
      const item = {
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        discount: data.discount,
      };

      if (isNewItem) {
        createInvoiceItemMutation.mutateAsync({ invoiceId: showDialog.data.invoiceId, item }).then(() => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog.data.invoiceId]);
          close();
        });
      } else {
        updateInvoiceItemMutation
          .mutateAsync({
            invoiceId: showDialog.data.invoiceId,
            itemId: showDialog.data.itemId,
            item,
          })
          .then(() => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, showDialog.data.invoiceId]);
            close();
          });
      }
    },
    [isNewItem, showDialog, close, queryClient, createInvoiceItemMutation, updateInvoiceItemMutation],
  );

  return (
    <Dialog aria-label="invoice item dialog" className="rounded relative" isOpen={show} onDismiss={() => close()}>
      <div style={{ top: '10px', right: '15px' }} className="absolute">
        <button className="outline-none focus:outline-none" onClick={() => close()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden className="uppercase">
            ×
          </span>
        </button>
      </div>
      <div className="relative pb-2 border-b border-gray-300">
        <h2 className="font-bold text-primary text-lg">Item</h2>
      </div>
      <div className="text-gray-700 text-base mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-3">
              <FormField type="text" placeholder="Name" label="Name" {...register('name')} error={errors?.name} />
            </div>

            <div className="col-span-3">
              <FormField
                type="number"
                placeholder="Quantity"
                label="Quantity"
                {...register('quantity')}
                error={errors?.quantity}
              />
            </div>

            <div className="col-span-3">
              <FormField
                type="number"
                step="0.01"
                placeholder="Unit Price"
                label="Unit Price"
                {...register('unitPrice')}
                error={errors?.unitPrice}
              />
            </div>

            <div className="col-span-3">
              <FormField
                type="number"
                placeholder="Discount"
                label="Discount"
                {...register('discount')}
                error={errors?.discount}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit">{isNewItem ? 'Create' : 'Edit'}</Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from '../../components/button';
import { FormField, FormSelectField, FormTextareaField } from '../../components/form';
import currencies from '../../currencies.json';
import {
  QUERY_KEYS,
  useClientsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from '../../libs/react-query';
import { useInvoiceStore } from './stores';

export const invoiceSchemaValidation = yup
  .object({
    invoiceNumber: yup.string().required(),
    client: yup.string().required(),
    rates: yup.number().required(),
    notes: yup.string(),
    type: yup.string().required(),
    dueDate: yup.date().required(),
    currency: yup.string().required(),
    billingAddress: yup.string().required(),
    shippingAddress: yup.string().required(),
  })
  .required();

export function Invoice() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const invoiceState = useInvoiceStore((state) => state.invoice);
  const isNewInvoice = useMemo(() => !invoiceState, [invoiceState]);
  const { data: clients = [] } = useClientsQuery();
  const clientsOptions = useMemo(
    () =>
      clients.map((client) => ({
        value: client._id,
        label: `${client.lastName} ${client.firstName} (${client.email})`,
      })),
    [clients],
  );
  const currenciesOptions = useMemo(
    () =>
      currencies.map(({ value, label, countryCode }) => ({
        value,
        id: countryCode,
        label: `${label} (${value})`,
      })),
    [],
  );
  const createInvoiceMutation = useCreateInvoiceMutation();
  const updateInvoiceMutation = useUpdateInvoiceMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(invoiceSchemaValidation),
  });

  const watchClient = watch('client');

  const addressOptions = useMemo(() => {
    if (!watchClient) {
      return [];
    }

    const client = clients.find((cl) => cl._id === watchClient);

    if (!client) {
      return [];
    }
    return client.address.map((address) => ({
      value: address._id,
      label: `${address.name}`,
    }));
  }, [clients, watchClient]);

  useEffect(() => {
    if (!invoiceState) {
      reset({
        invoiceNumber: Math.floor(Math.random() * 100_000),
        type: 'Invoice',
      });
    } else {
      reset({
        invoiceNumber: invoiceState.invoiceNumber,
        client: invoiceState.client?._id,
        rates: invoiceState.rates,
        notes: invoiceState.notes,
        type: invoiceState.type,
        dueDate: format(new Date(invoiceState.dueDate), 'yyyy-MM-dd'),
        currency: invoiceState.currency,
        billingAddress: invoiceState.billingAddress?._id,
        shippingAddress: invoiceState.shippingAddress?._id,
      });
    }
  }, [invoiceState, reset]);

  const onSubmit = useCallback(
    async (data) => {
      const client = clients.find((cl) => cl._id === data.client);

      const invoiceData = {
        invoiceNumber: data.invoiceNumber,
        client: data.client,
        rates: data.rates,
        notes: data.notes,
        type: data.type,
        dueDate: data.dueDate,
        currency: data.currency,
        billingAddress: client.address.find((add) => add._id === data.billingAddress),
        shippingAddress: client.address.find((add) => add._id === data.shippingAddress),
      };

      if (isNewInvoice) {
        createInvoiceMutation.mutateAsync({ invoice: invoiceData }).then((res) => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICES_QUERY]);
          navigate(`/invoices/${res._id}`);
        });
      } else {
        updateInvoiceMutation.mutateAsync({ invoiceId: invoiceState._id, updates: invoiceData }).then(() => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICES_QUERY]);
          queryClient.invalidateQueries([QUERY_KEYS.GET_INVOICE_QUERY, invoiceState._id]);
        });
      }
    },
    [createInvoiceMutation, updateInvoiceMutation, isNewInvoice, invoiceState, navigate, queryClient, clients],
  );

  return (
    <div className="bg-white shadow rounded-md p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <FormSelectField placeholder="Type" label="Type" {...register('type')} error={errors?.type}>
              <option value="Invoice">Invoice</option>
              <option value="Receipt">Receipt</option>
              <option value="Estimate">Estimate</option>
              <option value="Bill">Bill</option>
              <option value="Quotation">Quotation</option>
            </FormSelectField>
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField
              type="text"
              placeholder="Invoice Number"
              label="Invoice Number"
              {...register('invoiceNumber')}
              error={errors?.invoiceNumber}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField
              type="date"
              placeholder="Due Date"
              label="Due Date"
              {...register('dueDate')}
              error={errors?.dueDate}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormSelectField label="Client" {...register('client')} error={errors?.client}>
              <option value="">Select a client...</option>
              {clientsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormSelectField label="Billing Address" {...register('billingAddress')} error={errors?.billingAddress}>
              <option value="">Select a billing address...</option>
              {addressOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormSelectField label="Shipping Address" {...register('shippingAddress')} error={errors?.shippingAddress}>
              <option value="">Select a shipping address...</option>
              {addressOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField type="text" placeholder="Rates" label="Rates %" {...register('rates')} error={errors?.rates} />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormSelectField label="Currency" {...register('currency')} error={errors?.currency}>
              <option value="">Select a currency...</option>
              {currenciesOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>
          <div className="col-span-6">
            <FormTextareaField
              rows={4}
              placeholder="Notes"
              label="Notes"
              {...register('notes')}
              error={errors?.notes}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit">{isNewInvoice ? 'Create' : 'Edit'}</Button>
        </div>
      </form>
    </div>
  );
}

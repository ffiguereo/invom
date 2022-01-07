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
import { QUERY_KEYS, useCreateClientAddressMutation, useUpdateClientAddressMutation } from '../../../libs/react-query';

export const clientAddressSchemaValidation = yup
  .object({
    name: yup.string().required(),
    idNumber: yup.string(),
    phone: yup.string().required(),
    address: yup.string().required(),
    addressExtra: yup.string(),
    postalCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string().required(),
  })
  .required();

export function ClientAddressDialog() {
  const { showDialog, isOpen, close } = useDialogues();
  const queryClient = useQueryClient();
  const isNewAddress = useMemo(() => !showDialog?.data?.addressId || !showDialog?.data?.address, [showDialog]);
  const show = useMemo(() => isOpen(DialogEnum.ClientAddress), [isOpen]);
  const createClientAddressMutation = useCreateClientAddressMutation();
  const updateClientAddressMutation = useUpdateClientAddressMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(clientAddressSchemaValidation),
  });

  useEffect(() => {
    if (!showDialog?.data?.address) {
      reset({});
    } else {
      reset({
        name: showDialog.data.address.name,
        idNumber: showDialog.data.address?.idNumber,
        phone: showDialog.data.address.phone,
        address: showDialog.data.address.address,
        addressExtra: showDialog.data.address?.addressExtra,
        postalCode: showDialog.data.address?.postalCode,
        city: showDialog.data.address?.city,
        state: showDialog.data.address?.state,
        country: showDialog.data.address.country,
      });
    }
  }, [showDialog, reset]);

  const onSubmit = useCallback(
    async (data) => {
      const address = {
        name: data.name,
        idNumber: data.idNumber,
        phone: data.phone,
        address: data.address,
        addressExtra: data.addressExtra,
        postalCode: data.postalCode,
        city: data.city,
        state: data.state,
        country: data.country,
      };

      if (isNewAddress) {
        createClientAddressMutation.mutateAsync({ clientId: showDialog.data.clientId, address }).then(() => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENT_QUERY, showDialog.data.clientId]);
          close();
        });
      } else {
        updateClientAddressMutation
          .mutateAsync({
            clientId: showDialog.data.clientId,
            addressId: showDialog.data.addressId,
            address,
          })
          .then(() => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENT_QUERY, showDialog.data.clientId]);
            close();
          });
      }
    },
    [isNewAddress, showDialog, queryClient, updateClientAddressMutation, createClientAddressMutation, close],
  );

  return (
    <Dialog aria-label="client address dialog" className="rounded relative" isOpen={show} onDismiss={() => close()}>
      <div style={{ top: '10px', right: '15px' }} className="absolute">
        <button className="outline-none focus:outline-none" onClick={() => close()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden className="uppercase">
            ×
          </span>
        </button>
      </div>
      <div className="relative pb-2 border-b border-gray-300">
        <h2 className="font-bold text-primary text-lg">Address</h2>
      </div>
      <div className="text-gray-700 text-base mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-3">
              <FormField type="text" placeholder="Name" label="Name" {...register('name')} error={errors?.name} />
            </div>
            <div className="col-span-3">
              <FormField
                type="text"
                placeholder="DNI / NIE / NIF"
                label="DNI / NIE / NIF"
                {...register('idNumber')}
                error={errors?.idNumber}
              />
            </div>
            <div className="col-span-3">
              <FormField type="text" placeholder="Phone" label="Phone" {...register('phone')} error={errors?.phone} />
            </div>
            <div className="col-span-3">
              <FormField
                type="text"
                placeholder="Country"
                label="Country"
                {...register('country')}
                error={errors?.country}
              />
            </div>
            <div className="col-span-6">
              <FormField
                type="text"
                placeholder="Address"
                label="Address"
                {...register('address')}
                error={errors?.address}
              />
            </div>
            <div className="col-span-3">
              <FormField
                type="text"
                placeholder="Address Extra"
                label="Address Extra"
                {...register('addressExtra')}
                error={errors?.addressExtra}
              />
            </div>
            <div className="col-span-3">
              <FormField
                type="text"
                placeholder="Postal Code"
                label="Postal Code"
                {...register('postalCode')}
                error={errors?.postalCode}
              />
            </div>
            <div className="col-span-3">
              <FormField type="text" placeholder="City" label="City" {...register('city')} error={errors?.city} />
            </div>
            <div className="col-span-3">
              <FormField type="text" placeholder="State" label="State" {...register('state')} error={errors?.state} />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit">{isNewAddress ? 'Create' : 'Edit'}</Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

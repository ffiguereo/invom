import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from '../../components/button';
import { FormField } from '../../components/form';
import { QUERY_KEYS, useClientQuery, useCreateClientMutation, useUpdateClientMutation } from '../../libs/react-query';

export const clientSchemaValidation = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string(),
  })
  .required();

export function Client() {
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const isNewClient = useMemo(() => clientId === 'new', [clientId]);
  const { isLoading, data: client, error, isError } = useClientQuery({ clientId, options: { enabled: !isNewClient } });
  const createClientMutation = useCreateClientMutation();
  const updateClientMutation = useUpdateClientMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(clientSchemaValidation),
  });

  useEffect(() => {
    if (!client) {
      reset();
    } else {
      reset({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
      });
    }
  }, [client]);

  const onSubmit = useCallback(
    async (data) => {
      const clientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      };

      if (isNewClient) {
        createClientMutation.mutateAsync({ client: clientData }).then((res) => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENTS_QUERY]);
          navigate(`/clients/${res._id}`);
        });
      } else {
        updateClientMutation.mutateAsync({ clientId, updates: clientData }).then(() => {
          queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENTS_QUERY]);
          queryClient.invalidateQueries([QUERY_KEYS.GET_CLIENT_QUERY, clientId]);
        });
      }
    },
    [createClientMutation, updateClientMutation, isNewClient],
  );

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return (
      <div>
        <h1>Client Error</h1>
        <code>{JSON.stringify(error, 2)}</code>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-md p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <FormField
              type="text"
              placeholder="First name"
              label="First name"
              {...register('firstName')}
              error={errors?.firstName}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField
              type="text"
              placeholder="Last name"
              label="Last name"
              {...register('lastName')}
              error={errors?.lastName}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField
              type="email"
              placeholder="Email address"
              label="Email address"
              autoComplete="email"
              {...register('email')}
              error={errors?.email}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <FormField type="text" placeholder="Phone" label="Phone" {...register('phone')} error={errors?.phone} />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit">{isNewClient ? 'Create' : 'Edit'}</Button>
        </div>
      </form>
    </div>
  );
}

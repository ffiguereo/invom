import { QueryClient, useMutation, useQuery } from 'react-query';

import {
  addClient,
  addClientAddress,
  addInvoice,
  addInvoiceItem,
  addInvoicePayment,
  addUser,
  deleteClient,
  deleteClientAddress,
  deleteInvoice,
  deleteInvoiceItem,
  deleteInvoicePayment,
  deleteUser,
  fetchClient,
  fetchClients,
  fetchEnterprise,
  fetchInvoice,
  fetchInvoices,
  fetchUser,
  fetchUsers,
  updateClient,
  updateClientAddress,
  updateEnterprise,
  updateInvoice,
  updateInvoiceItem,
  updateInvoicePayment,
  updateUser,
} from '../api';

// React query client

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

export const QUERY_KEYS = {
  GET_INVOICE_QUERY: 'GET_INVOICE_QUERY',
  GET_INVOICES_QUERY: 'GET_INVOICES_QUERY',
  GET_CLIENT_QUERY: 'GET_CLIENT_QUERY',
  GET_CLIENTS_QUERY: 'GET_CLIENTS_QUERY',
  GET_ENTERPRISE_QUERY: 'GET_ENTERPRISE_QUERY',
  GET_USER_QUERY: 'GET_USER_QUERY',
  GET_USERS_QUERY: 'GET_USERS_QUERY',
};

// Invoices

export function useInvoiceQuery({ invoiceId, options = {} }) {
  return useQuery(
    [QUERY_KEYS.GET_INVOICE_QUERY, invoiceId],
    () => fetchInvoice(invoiceId).then((res) => res.data),
    options,
  );
}

export function useInvoicesQuery() {
  return useQuery([QUERY_KEYS.GET_INVOICES_QUERY], () => fetchInvoices({}).then((res) => res.data));
}

export function useCreateInvoiceMutation() {
  return useMutation(({ invoice }) => addInvoice(invoice).then((res) => res.data));
}

export function useUpdateInvoiceMutation() {
  return useMutation(({ invoiceId, updates }) => updateInvoice(invoiceId, updates).then((res) => res.data));
}

export function useRemoveInvoiceMutation() {
  return useMutation(({ invoiceId }) => deleteInvoice(invoiceId).then((res) => res.data));
}

export function useCreateInvoiceItemMutation() {
  return useMutation(({ invoiceId, item }) => addInvoiceItem({ invoiceId, item }).then((res) => res.data));
}

export function useUpdateInvoiceItemMutation() {
  return useMutation(({ invoiceId, itemId, item }) =>
    updateInvoiceItem({ invoiceId, itemId, item }).then((res) => res.data),
  );
}

export function useRemoveInvoiceItemMutation() {
  return useMutation(({ invoiceId, itemId }) => deleteInvoiceItem({ invoiceId, itemId }).then((res) => res.data));
}

export function useCreateInvoicePaymentMutation() {
  return useMutation(({ invoiceId, payment }) => addInvoicePayment({ invoiceId, payment }).then((res) => res.data));
}

export function useUpdateInvoicePaymentMutation() {
  return useMutation(({ invoiceId, paymentId, payment }) =>
    updateInvoicePayment({ invoiceId, paymentId, payment }).then((res) => res.data),
  );
}

export function useRemoveInvoicePaymentMutation() {
  return useMutation(({ invoiceId, paymentId }) =>
    deleteInvoicePayment({ invoiceId, paymentId }).then((res) => res.data),
  );
}

// Clients

export function useClientQuery({ clientId, options = {} }) {
  return useQuery(
    [QUERY_KEYS.GET_CLIENT_QUERY, clientId],
    () => fetchClient(clientId).then((res) => res.data),
    options,
  );
}

export function useClientsQuery() {
  return useQuery([QUERY_KEYS.GET_CLIENTS_QUERY], () => fetchClients({}).then((res) => res.data));
}

export function useCreateClientMutation() {
  return useMutation(({ client }) => addClient(client).then((res) => res.data));
}

export function useUpdateClientMutation() {
  return useMutation(({ clientId, updates }) => updateClient(clientId, updates).then((res) => res.data));
}

export function useRemoveClientMutation() {
  return useMutation(({ clientId }) => deleteClient(clientId).then((res) => res.data));
}

export function useCreateClientAddressMutation() {
  return useMutation(({ clientId, address }) => addClientAddress({ clientId, address }).then((res) => res.data));
}

export function useUpdateClientAddressMutation() {
  return useMutation(({ clientId, addressId, address }) =>
    updateClientAddress({ clientId, addressId, address }).then((res) => res.data),
  );
}

export function useRemoveClientAddressMutation() {
  return useMutation(({ clientId, addressId }) => deleteClientAddress({ clientId, addressId }).then((res) => res.data));
}

// Enterprise

export function useEnterpriseQuery() {
  return useQuery([QUERY_KEYS.GET_ENTERPRISE_QUERY], () => fetchEnterprise().then((res) => res.data));
}

export function useUpdateEnterpriseMutation() {
  return useMutation(({ updates }) => updateEnterprise(updates).then((res) => res.data));
}

// Users

export function useUserQuery({ userId }) {
  return useQuery([QUERY_KEYS.GET_USER_QUERY, userId], () => fetchUser(userId).then((res) => res.data));
}

export function useUsersQuery(query = {}) {
  return useQuery([QUERY_KEYS.GET_USERS_QUERY, query], () => fetchUsers(query).then((res) => res.data));
}

export function useCreateUserMutation() {
  return useMutation(({ user }) => addUser(user).then((res) => res.data));
}

export function useUpdateUserMutation() {
  return useMutation(({ userId, updates }) => updateUser(userId, updates).then((res) => res.data));
}

export function useRemoveUserMutation() {
  return useMutation(({ userId }) => deleteUser(userId).then((res) => res.data));
}

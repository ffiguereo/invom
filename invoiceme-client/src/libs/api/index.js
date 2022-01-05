import axios from 'axios';

import { apiConfig } from '../../utils/config';

export async function getToken() {
  return window.localStorage.getItem(apiConfig.localStorageKey);
}
export function handleUserResponse({ data }) {
  window.localStorage.setItem(apiConfig.localStorageKey, data.token);
  return data;
}
export async function logout() {
  window.localStorage.removeItem(apiConfig.localStorageKey);
  window.location.reload();
}

// Axios instances

const API = axios.create({ baseURL: apiConfig.baseUrl });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem(apiConfig.localStorageKey);
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(undefined, async (error) => {
  if (error.response.status === 401) {
    await logout();

    return;
  }

  throw error;
});

// Invoices

export function fetchInvoice(id) {
  return API.get(`/invoices/${id}`);
}
export function fetchInvoices(query = {}) {
  const q = new URLSearchParams(query).toString();
  return API.get(`/invoices?${q}`);
}
export function addInvoice(invoice) {
  return API.post('/invoices', invoice);
}
export function updateInvoice(id, updatedInvoice) {
  return API.patch(`/invoices/${id}`, updatedInvoice);
}
export function deleteInvoice(id) {
  return API.delete(`/invoices/${id}`);
}
export function addInvoiceItem({ invoiceId, item }) {
  return API.post(`/invoices/${invoiceId}/items`, item);
}
export function updateInvoiceItem({ invoiceId, itemId, item }) {
  return API.patch(`/invoices/${invoiceId}/items/${itemId}`, item);
}
export const deleteInvoiceItem = ({ invoiceId, itemId }) => {
  return API.delete(`/invoices/${invoiceId}/items/${itemId}`);
};
export const addInvoicePayment = ({ invoiceId, payment }) => {
  return API.post(`/invoices/${invoiceId}/payments`, payment);
};
export const updateInvoicePayment = ({ invoiceId, paymentId, payment }) => {
  return API.patch(`/invoices/${invoiceId}/payments/${paymentId}`, payment);
};
export function deleteInvoicePayment({ invoiceId, paymentId }) {
  return API.delete(`/invoices/${invoiceId}/payments/${paymentId}`);
}

// Clients

export function fetchClient(id) {
  return API.get(`/clients/${id}`);
}
export function fetchClients(query = {}) {
  const q = new URLSearchParams(query).toString();
  return API.get(`/clients?${q}`);
}
export function addClient(client) {
  return API.post('/clients', client);
}
export function updateClient(id, updatedClient) {
  return API.patch(`/clients/${id}`, updatedClient);
}
export function deleteClient(id) {
  return API.delete(`/clients/${id}`);
}
export function addClientAddress({ clientId, address }) {
  return API.post(`/clients/${clientId}/address`, address);
}
export function updateClientAddress({ clientId, addressId, address }) {
  return API.patch(`/clients/${clientId}/address/${addressId}`, address);
}
export function deleteClientAddress({ clientId, addressId }) {
  return API.delete(`/clients/${clientId}/address/${addressId}`);
}

// Users

export function fetchUser(id) {
  return API.get(`/users/${id}`);
}
export function fetchUsers(query = {}) {
  const q = new URLSearchParams(query).toString();
  return API.get(`/users?${q}`);
}
export function addUser(client) {
  return API.post('/users', client);
}
export function updateUser(id, updatedUser) {
  return API.patch(`/users/${id}`, updatedUser);
}
export function deleteUser(id) {
  return API.delete(`/users/${id}`);
}

// Auth

export function me() {
  return API.get('/auth/me');
}
export function signIn(formData) {
  return API.post('/auth/sign-in', formData).then(handleUserResponse);
}
export function signUp(formData) {
  return API.post('/auth/sign-up', formData).then(handleUserResponse);
}
export function forgotPassword(formData) {
  return API.post('/auth/forgot', formData);
}
export function resetPassword(formData) {
  return API.post('/auth/reset', formData);
}

// Enterprise

export function fetchEnterprise() {
  return API.get(`/enterprises`);
}

export function updateEnterprise(updatedEnterprise) {
  return API.patch(`/enterprises`, updatedEnterprise);
}

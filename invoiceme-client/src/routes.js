import { Navigate } from 'react-router-dom';

import { Layout } from './components/layout';
import { RequireAuth } from './components/require-auth';
import { Login, Register } from './features/auth';
import { Client, ClientAddress, Clients } from './features/clients';
import { ClientLayout } from './features/clients/components';
import { Dashboard } from './features/dashboard';
import { Invoice, InvoiceItems, InvoicePayments, Invoices, InvoiceSummary } from './features/invoices';
import { InvoiceLayout } from './features/invoices/components';

export const routes = [
  {
    path: '/',
    exact: true,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'clients', element: <Clients /> },
      {
        path: 'clients/:clientId',
        exact: true,
        element: <ClientLayout />,
        children: [
          { index: true, element: <Client /> },
          { path: 'address', element: <ClientAddress /> },
        ],
      },
      { path: 'invoices', element: <Invoices /> },
      {
        path: 'invoices/:invoiceId',
        exact: true,
        element: <InvoiceLayout />,
        children: [
          { index: true, element: <Invoice /> },
          { path: 'items', element: <InvoiceItems /> },
          { path: 'payments', element: <InvoicePayments /> },
          { path: 'summary', element: <InvoiceSummary /> },
        ],
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/sign-in',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <Register />,
  },
];

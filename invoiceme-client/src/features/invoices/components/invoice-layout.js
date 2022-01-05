import { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { useInvoiceQuery } from '../../../libs/react-query';
import { classNames } from '../../../utils/class-names';
import { useInvoiceStore } from '../stores';

const sideBarLinks = [
  {
    label: 'Items',
    to: 'items',
  },
  {
    label: 'Payments',
    to: 'payments',
  },
  {
    label: 'Summary',
    to: 'summary',
  },
];

export function InvoiceLayout() {
  const { invoiceId } = useParams();
  const invoiceState = useInvoiceStore((state) => state.invoice);
  const clearAction = useInvoiceStore((state) => state.clear);
  const updateAction = useInvoiceStore((state) => state.update);
  const isNewInvoice = useMemo(() => invoiceId === 'new', [invoiceId]);
  const invoiceNumber = useMemo(() => (invoiceState ? `Nº ${invoiceState.invoiceNumber}` : 'ID'), [invoiceState]);
  const invoiceStatus = useMemo(() => (invoiceState ? `${invoiceState.status}` : 'Draft'), [invoiceState]);
  const invoiceTotal = useMemo(
    () => (invoiceState ? `${invoiceState.currency} ${invoiceState.total}` : '0.00'),
    [invoiceState],
  );
  const invoicePaid = useMemo(
    () => (invoiceState ? `${invoiceState.currency} ${invoiceState.totalAmountReceived}` : '0.00'),
    [invoiceState],
  );
  const { isLoading, data: invoice } = useInvoiceQuery({ invoiceId, options: { enabled: !isNewInvoice } });

  useEffect(() => {
    if (!invoice) {
      clearAction();
    } else {
      updateAction(invoice);
    }

    return () => {
      clearAction();
    };
  }, [invoice, updateAction, clearAction]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="print:hidden fixed py-10 px-8 overflow-y-auto w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-300">
        <nav className="relative">
          <ul>
            <li className="flex w-full justify-between items-center mb-6">
              <NavLink
                className={({ isActive }) =>
                  classNames(isActive ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-500')
                }
                to={`/invoices/${invoiceId}`}
                end
              >
                Invoice
              </NavLink>
            </li>
            {sideBarLinks.map((link) => (
              <li key={link.to} className="flex w-full justify-between items-center mb-6">
                <NavLink
                  className={({ isActive }) =>
                    classNames(isActive ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-500')
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="print:hidden pl-[17rem] h-12 pr-6 bg-white shadow flex items-center">
          <div className="flex-1">
            <span className="font-bold text-gray-900">{invoiceNumber}</span>
            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {invoiceStatus}
            </span>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-center">
              <span className="text-gray-600 text-xs">amount</span>
              <span className="ml-2">{invoiceTotal}</span>
            </span>
            <span className="ml-4 font-bold text-gray-900 text-center">
              <span className="text-gray-600 text-xs">paid</span>
              <span className="ml-2">{invoicePaid}</span>
            </span>
          </div>
        </div>
        <div className="print:p-0 py-10 pr-6 pl-[17rem]">
          <div className="w-full h-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

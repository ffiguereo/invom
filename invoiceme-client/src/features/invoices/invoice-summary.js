import { PrinterIcon } from '@heroicons/react/outline';
import { useCallback, useMemo } from 'react';

import { useAuth } from '../../context/auth-context';
import { InvoiceAddress } from './components';
import { useInvoiceStore } from './stores';

export function InvoiceSummary() {
  const { user } = useAuth();
  const invoiceState = useInvoiceStore((state) => state.invoice);
  const dueDate = useMemo(() => {
    if (!invoiceState?.dueDate) {
      return null;
    }
    return new Intl.DateTimeFormat().format(new Date(invoiceState?.dueDate));
  }, [invoiceState]);

  const invoiceDate = useMemo(() => {
    if (!invoiceState?.createdAt) {
      return null;
    }
    return new Intl.DateTimeFormat().format(new Date(invoiceState?.createdAt));
  }, [invoiceState]);

  const handlePrinter = useCallback((event) => {
    event.preventDefault();

    window.print();
  }, []);

  const enterpriseAddress = useMemo(
    () => ({
      idNumber: user.enterprise?.idNumber,
      phone: user.enterprise?.phone,
      address: user.enterprise?.address?.address,
      addressExtra: user.enterprise?.address?.addressExtra,
      city: user.enterprise?.address?.city,
      state: user.enterprise?.address?.state,
      country: user.enterprise?.address?.country,
      postalCode: user.enterprise?.address?.postalCode,
    }),
    [user],
  );

  return (
    <div className="container print:h-full print:container-none print:p-0 mx-auto py-6 px-4 print:bg-white bg-white print:rounded-none rounded-md print:shadow-none shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-4xl font-bold pb-2 tracking-wider uppercase">Invoice</h2>
        <div className="print:hidden mr-1">
          <button onClick={handlePrinter}>
            <PrinterIcon className="w-8 h-8 text-indigo-600 hover:text-indigo-700" />
          </button>
        </div>
      </div>

      <div className="flex mb-8 justify-between">
        <InvoiceAddress address={enterpriseAddress} title={user?.enterprise.name} />
      </div>

      <div className="flex flex-wrap mb-8">
        <div className="flex-1 flex">
          <div className="w-1/2">
            <InvoiceAddress address={invoiceState?.billingAddress} title="Bill To" />
          </div>
          <div className="w-1/2">
            <InvoiceAddress address={invoiceState?.shippingAddress} title="Ship To" />
          </div>
        </div>
        <div>
          <div className="flex items-center -mt-2">
            <p className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Nº</p>
            <div className="flex-1">
              <p className="w-full py-2 text-gray-700 leading-tight">{invoiceState?.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center">
            <p className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</p>
            <div className="flex-1">
              <p className="w-full py-2 text-gray-700 leading-tight">{invoiceDate}</p>
            </div>
          </div>

          <div className="flex items-center">
            <p className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</p>
            <div className="flex-1">
              <p className="w-full py-2 text-gray-700 leading-tight">{dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex -mx-1 border-b py-2 items-start">
        <div className="flex-1 px-1">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">Description</p>
        </div>

        <div className="px-1 w-20 text-right">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">Units</p>
        </div>

        <div className="px-1 w-32 text-right">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">Unit Price</p>
        </div>

        <div className="px-1 w-20 text-right">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">Dic</p>
        </div>

        <div className="px-1 w-32 text-right">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">Amount</p>
        </div>
      </div>
      {invoiceState?.items.map((item) => (
        <div key={item._id} className="flex -mx-1 py-2 border-b">
          <div className="flex-1 px-1">
            <p className="text-gray-800">{item.name}</p>
          </div>

          <div className="px-1 w-20 text-right">
            <p className="text-gray-800">{item.quantity}</p>
          </div>

          <div className="px-1 w-32 text-right">
            <p className="text-gray-800">{item.unitPrice}</p>
          </div>

          <div className="px-1 w-20 text-right">
            <p className="text-gray-800">{item.discount}%</p>
          </div>

          <div className="px-1 w-32 text-right">
            <p className="text-gray-800">{item.amount}</p>
          </div>
        </div>
      ))}

      <div className="py-2 ml-auto mt-8 w-full sm:w-2/4 lg:w-1/4">
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">Subtotal</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium">{invoiceState?.subtotal}</div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">VAT({invoiceState?.rates}%)</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium">{invoiceState?.vat}</div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">Total</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium">
              {invoiceState?.currency} {invoiceState?.total}
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">Paid</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium">
              {invoiceState?.currency} {invoiceState?.totalAmountReceived}
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">Balance</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium">
              {invoiceState?.currency} {invoiceState?.balance}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Notes</p>
        <p className="mb-1 w-full text-gray-700">{invoiceState?.notes}</p>
      </div>
    </div>
  );
}

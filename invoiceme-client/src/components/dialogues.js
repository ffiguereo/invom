import {
  ClientAddressDialog,
  ClientAddressRemoveAlertDialog,
  ClientRemoveAlertDialog,
} from '../features/clients/components';
import {
  InvoiceItemDialog,
  InvoiceItemRemoveAlertDialog,
  InvoicePaymentDialog,
  InvoicePaymentRemoveAlertDialog,
  InvoiceRemoveAlertDialog,
} from '../features/invoices/components';

export function Dialogues() {
  return (
    <>
      <ClientAddressDialog />
      <ClientRemoveAlertDialog />
      <ClientAddressRemoveAlertDialog />
      <InvoiceItemDialog />
      <InvoicePaymentDialog />
      <InvoiceRemoveAlertDialog />
      <InvoiceItemRemoveAlertDialog />
      <InvoicePaymentRemoveAlertDialog />
    </>
  );
}

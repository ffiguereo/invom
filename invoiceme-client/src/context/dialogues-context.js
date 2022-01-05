import React from 'react';

const DialoguesContext = React.createContext();
DialoguesContext.displayName = 'DialoguesContext';

export const Dialog = {
  ClientAddress: 'CLIENT_ADDRESS',
  ClientAddressRemove: 'CLIENT_ADDRESS_REMOVE',
  ClientRemove: 'CLIENT_REMOVE',
  InvoiceItem: 'INVOICE_ITEM',
  InvoicePayment: 'INVOICE_PAYMENT',
  InvoiceRemove: 'INVOICE_REMOVE',
  InvoiceItemRemove: 'INVOICE_ITEM_REMOVE',
  InvoicePaymentRemove: 'INVOICE_PAYMENT_REMOVE',
};

export function DialoguesProvider(props) {
  const [showDialog, setShowDialog] = React.useState();

  const close = React.useCallback(() => setShowDialog(null), [setShowDialog]);
  const open = React.useCallback((dialog, data = null) => setShowDialog({ dialog, data }), [setShowDialog]);
  const isOpen = React.useCallback((dialog) => Boolean(showDialog) && showDialog?.dialog === dialog, [showDialog]);

  const value = React.useMemo(() => ({ showDialog, close, open, isOpen }), [showDialog, close, open, isOpen]);

  return <DialoguesContext.Provider value={value} {...props} />;
}

export function useDialogues() {
  const context = React.useContext(DialoguesContext);
  if (context === undefined) {
    throw new Error(`useDialogues must be used within a DialoguesProvider`);
  }
  return context;
}

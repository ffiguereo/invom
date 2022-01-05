export function InvoiceAddress({ address, title }) {
  return (
    <div className="group">
      <p className="text-gray-800 block mb-1 font-bold print:text-xs uppercase tracking-wide">{title}</p>
      {address?.name ? <p className="mb-1 w-full print:text-xs text-gray-700">{address?.name}</p> : null}
      {address?.idNumber ? <p className="mb-1 w-full print:text-xs text-gray-700">{address?.idNumber}</p> : null}
      {address?.phone ? <p className="mb-1 w-full print:text-xs text-gray-700">{address?.phone}</p> : null}
      {address?.address ? <p className="mb-1 w-full print:text-xs text-gray-700">{address?.address}</p> : null}
      {address?.addressExtra ? (
        <p className="mb-1 w-full print:text-xs text-gray-700">{address?.addressExtra}</p>
      ) : null}
      <p className="mb-1 w-full print:text-xs text-gray-700">
        {address?.postalCode} {address?.city}
      </p>
      <p className="mb-1 w-full print:text-xs text-gray-700">
        {address?.state} {address?.country}
      </p>
    </div>
  );
}

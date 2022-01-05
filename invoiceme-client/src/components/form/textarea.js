import { useId } from '@reach/auto-id';
import React from 'react';

export const Textarea = React.forwardRef(({ id, ...props }, ref) => {
  const idX = useId(id);

  return (
    <textarea
      id={idX}
      className="rounded-md block w-full border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
      ref={ref}
      {...props}
    />
  );
});

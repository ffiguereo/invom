import { useId } from '@reach/auto-id';
import React from 'react';

export const Label = React.forwardRef(({ htmlFor, children, ...props }, ref) => {
  const htmlForX = useId(htmlFor);

  return (
    <label className="block text-gray-700 text-sm font-bold mb-2" ref={ref} htmlFor={htmlForX} {...props}>
      {children}
    </label>
  );
});

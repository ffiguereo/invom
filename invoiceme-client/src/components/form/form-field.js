import { useId } from '@reach/auto-id';
import React from 'react';

import { Input } from './input';
import { Label } from './label';

export const FormField = React.forwardRef(({ id, label, error, ...props }, ref) => {
  const idX = useId(id);

  return (
    <div className="mb-3">
      <Label htmlFor={idX}>{label}</Label>
      <Input id={idX} ref={ref} {...props} />
      {error ? <p className="text-red-500 text-xs italic mt-3">{error.message}</p> : null}
    </div>
  );
});

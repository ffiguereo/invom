import { useId } from '@reach/auto-id';
import React from 'react';

import { Label } from './label';
import { Select } from './select';

export const FormSelectField = React.forwardRef(({ id, label, error, ...props }, ref) => {
  const idX = useId(id);

  return (
    <div className="mb-3">
      <Label htmlFor={idX}>{label}</Label>
      <Select id={idX} ref={ref} {...props} />
      {error ? <p className="text-red-500 text-xs italic mt-3">{error.message}</p> : null}
    </div>
  );
});

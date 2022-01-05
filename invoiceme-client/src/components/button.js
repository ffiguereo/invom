import React from 'react';

import { classNames } from '../utils/class-names';

const PRIMARY = `disabled:hover:bg-indigo-600 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
const DANGER = `disabled:hover:bg-red-600 text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
const SUCCESS = `disabled:hover:bg-green-600 text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`;
const WARNING = `disabled:hover:bg-amber-600 text-white bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`;

export const Button = React.forwardRef(({ children, className, color, type, ...props }, ref) => {
  const variantClass = React.useMemo(() => {
    if (!color || color === 'primary') return PRIMARY;
    if (color === 'danger') return DANGER;
    if (color === 'success') return SUCCESS;
    if (color === 'warning') return WARNING;
    return PRIMARY;
  }, [color]);

  return (
    <button
      className={classNames(
        'flex justify-center py-2 px-4 disabled:opacity-75 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClass,
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

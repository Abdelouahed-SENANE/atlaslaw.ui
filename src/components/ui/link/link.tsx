import { Link , LinkProps } from 'react-router-dom';

import { cn } from '@/lib/utils';

export const RouterLink = ({ className, children, ...props }: LinkProps) => {
  return (
    <Link
    
      className={cn(
        className,
        'hover:underline-none cursor-pointer'
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

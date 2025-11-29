import { Link , LinkProps } from 'react-router-dom';

import { cn } from '@/lib/utils';

export const RouterLink = ({ className, children, ...props }: LinkProps) => {
  return (
    <Link
      className={cn(
        'text-link hover:text-foreground hover:underline',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

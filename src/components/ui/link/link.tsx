import { Link as RouterLink, LinkProps } from 'react-router-dom';

import { cn } from '@/lib/utils';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn(
        'text-link hover:text-foreground hover:underline',
        className
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = {
  default:
    'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
  success:
    'bg-success/10 text-success border border-success/30',
  warning:
    'bg-warning/10 text-warning border border-warning/30',
  danger:
    'bg-danger/10 text-danger border border-danger/30',
  info:
    'bg-secondary/10 text-secondary border border-secondary/20',
};

type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';


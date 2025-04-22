import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size])}
      >
        <rect width="32" height="32" rx="8" fill="#634AFF" />
        <path
          d="M9 10C9 9.44772 9.44772 9 10 9H16C16.5523 9 17 9.44772 17 10V22C17 22.5523 16.5523 23 16 23H10C9.44772 23 9 22.5523 9 22V10Z"
          fill="white"
        />
        <path
          d="M19 10C19 9.44772 19.4477 9 20 9H22C22.5523 9 23 9.44772 23 10V22C23 22.5523 22.5523 23 22 23H20C19.4477 23 19 22.5523 19 22V10Z"
          fill="white"
        />
        <path
          d="M12 13H14M12 16H14M12 19H14"
          stroke="#634AFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn('font-semibold', {
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-lg': size === 'lg',
        })}
      >
        Syncro
      </span>
    </div>
  );
}

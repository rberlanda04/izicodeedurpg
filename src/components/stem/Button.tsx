import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-stem-teal text-white border-b-4 border-stem-teal-dark hover:bg-stem-teal-dark active:border-b-0 active:translate-y-1',
  secondary:
    'bg-stem-amber text-stem-ink border-b-4 border-[#c97f2e] hover:brightness-95 active:border-b-0 active:translate-y-1',
  ghost: 'bg-transparent text-stem-ink border-2 border-stem-line hover:bg-stem-mist',
  danger:
    'bg-stem-coral text-white border-b-4 border-[#c94039] hover:brightness-95 active:border-b-0 active:translate-y-1'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...rest
}) => (
  <button
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-wide rounded-2xl px-5 py-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:translate-y-0 disabled:active:border-b-4 ${
      variantClasses[variant]
    } ${fullWidth ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

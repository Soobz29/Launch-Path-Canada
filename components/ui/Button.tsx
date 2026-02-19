import React from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false, 
  className = '', 
  disabled,
  to,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-14 px-8 text-lg"
  };
  
  const variants = {
    primary: "bg-canada-red text-white hover:bg-canada-dark focus:ring-canada-red",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-800",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900 focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
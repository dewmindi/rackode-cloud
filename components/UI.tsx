import React from 'react';
import { ChevronRight } from 'lucide-react';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-md";
  
  const variants = {
    primary: "bg-blue-400 text-white hover:bg-blue-600 shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-black text-white hover:bg-gray-900 shadow-sm border border-blue-400",
    outline: "bg-transparent text-black border border-blue-400 hover:border-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100 border border-transparent",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3.5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
      {icon && <ChevronRight className="ml-1.5 w-4 h-4" />}
    </button>
  );
};

// --- CARDS ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${hoverEffect ? 'hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

// --- BADGE ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'gray'; className?: string }> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// --- SECTION WRAPPER ---
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  background?: 'white' | 'gray';
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '', 
  id, 
  fullWidth = false,
  background = 'white'
}) => {
  const bgClass = background === 'white' ? 'bg-white' : 'bg-gray-50';
  
  return (
    <section id={id} className={`py-16 relative overflow-hidden ${bgClass} ${className}`}>
      <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {children}
      </div>
    </section>
  );
};
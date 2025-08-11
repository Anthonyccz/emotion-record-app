import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: hover ? 1.02 : 1, y: hover ? -2 : 0 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClasses, paddingClasses[padding], 'cursor-pointer', className)}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div
      className={cn(baseClasses, paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-800', className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('text-gray-600', className)}>
      {children}
    </div>
  );
};
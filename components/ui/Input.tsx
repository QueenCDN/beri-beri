
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  IconComponent?: React.ElementType;
}

const Input: React.FC<InputProps> = ({ label, id, error, IconComponent, className = '', type="text", ...props }) => {
  const baseInputClasses = "block w-full rounded-xl border-0 py-3 px-4 bg-brand-surface text-brand-light shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-brand-muted focus:ring-2 focus:ring-inset focus:ring-brand-purple sm:text-sm sm:leading-6 transition-colors duration-200";
  
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium leading-6 text-brand-light mb-1">{label}</label>}
      <div className="relative">
        {IconComponent && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IconComponent className="h-5 w-5 text-brand-muted" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`${baseInputClasses} ${IconComponent ? 'pl-10' : ''} ${className} ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-700 focus:ring-brand-purple'}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;

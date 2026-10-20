import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: InputProps) => {
  return (
    <input 
      className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-lg px-4 py-2 outline-none focus:border-[var(--pm-accent)] transition-all duration-200"
      {...props}
    />
  );
};

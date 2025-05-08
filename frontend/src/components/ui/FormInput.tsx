import * as React from "react";
import { Input } from "./Input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  leftIcon,
  className,
  helperText,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        <Input
          id={id}
          className={cn(
            leftIcon && "pl-10",
            error &&
              "border-red-500 ring-red-500/20 focus-visible:ring-red-500/30",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

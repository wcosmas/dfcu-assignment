import React from "react";
import { Input } from "./Input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  leftIcon,
  id,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <Input
          id={id}
          className={cn(
            leftIcon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive/20",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

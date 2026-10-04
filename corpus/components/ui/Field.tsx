import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  hint?: string;
  error?: string | null;
  wrapperClassName?: string;
}

/** Labelled text field for the auth and settings surfaces. */
export function Field({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  id,
  ...rest
}: FieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("cx-field", wrapperClassName)}>
      <label className="cx-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn("cx-input", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? errorId : hint ? hintId : undefined
        }
        {...rest}
      />
      {error ? (
        <p id={errorId} className="cx-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="cx-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

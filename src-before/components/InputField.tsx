import React, { type FC, type ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  value: string | number;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  className?: string;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  autoComplete,
  onChange,
  onBlur,
  className = "",
}) => {
  const showError = !!touched && !!error;
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className={`input-field ${className}`}>
      <label htmlFor={fieldId} className="input-field__label">
        {label}
        {required && (
          <span className="input-field__required" aria-label="必須">
            *
          </span>
        )}
      </label>

      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={`input-field__input ${
          showError ? "input-field__input--error" : ""
        }`}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
      />

      {showError && (
        <span id={errorId} className="input-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

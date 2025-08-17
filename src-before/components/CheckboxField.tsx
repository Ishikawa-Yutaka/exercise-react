import React, { type FC, type ChangeEvent } from 'react';

// 【課題30】CheckboxFieldPropsインターフェースを定義してください
interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  error?: string;
  touched?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export const CheckboxField: FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  const showError = touched && error;

  return (
    <div className="form-field form-field--checkbox">
      <div className="checkbox-wrapper">
        {/* 【課題31】checkbox input要素を実装してください */}
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          className="checkbox-wrapper__input"
          aria-invalid={!!showError}
          aria-describedby={showError ? `${name}-error` : undefined}
        />

        {/* 【課題32】チェックボックスのラベルを実装してください */}
        <label
          htmlFor={name}
          className="checkbox-wrapper__label"
        >
          {label}
        </label>
      </div>

      {showError && (
        <span
          id={`${name}-error`}
          className="form-field__error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
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
    <div className="checkbox-field">
      <div className="checkbox-field__wrapper">
        {/* 【課題31】checkbox input要素を実装してください */}
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          className="checkbox-field__input"
          aria-invalid={!!showError}
          aria-describedby={showError ? `${name}-error` : undefined}
        />

        {/* 【課題32】チェックボックスのラベルを実装してください */}
        <label
          htmlFor={name}
          className="checkbox-field__label"
        >
          <span className="checkbox-field__checkmark"></span>
          <span className="checkbox-field__text">{label}</span>
        </label>
      </div>

      {showError && (
        <span
          id={`${name}-error`}
          className="checkbox-field__error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
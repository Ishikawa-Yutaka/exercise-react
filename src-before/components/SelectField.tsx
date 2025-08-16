import React, { type FC, type ChangeEvent } from 'react';

// 【課題24】SelectOptionインターフェースを定義してください
interface SelectOption {
  value: string;
  label: string;
}

// 【課題25】SelectFieldPropsインターフェースを定義してください
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: SelectOption[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  error,
  touched,
  required,
  onChange,
  onBlur,
}) => {
  const showError = touched && error;

  return (
    <div className="form-field">
      {/* 【課題26】ラベル要素を実装してください */}
      <label htmlFor={name} className="form-field__label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      {/* 【課題27】select要素を実装してください */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-field__select ${showError ? 'form-field__select--error' : ''}`}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      >
        {/* 【課題28】デフォルトオプションを実装してください */}
        <option value="">選択してください</option>

        {/* 【課題29】オプションリストを実装してください */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
import React, { type FC, type ChangeEvent } from "react";

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
    <div className="input-field">
      {/* 【課題26】ラベル要素を実装してください */}
      <label htmlFor={name} className="input-field__label">
        {label}を選択
        {required && <span className="input-field__required">*</span>}
      </label>

      {/* 【課題27】select要素を実装してください */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input-field__select ${
          showError ? "input-field__select--error" : ""
        }`}
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
        <span id={`${name}-error`} className="input-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

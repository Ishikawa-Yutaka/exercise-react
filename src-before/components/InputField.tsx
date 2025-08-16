import React, { type FC, type ChangeEvent } from 'react';;

// 【課題18】InputFieldPropsインターフェースを定義してください
interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value: string | number;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

// 【課題19】InputFieldコンポーネントを実装してください
export const InputField: FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required,
  placeholder,
  onChange,
  onBlur,
}) => {
  // 【課題20】エラー表示条件を実装してください
  const showError = touched && error;

  return (
    <div className="form-field">
      {/* 【課題21】ラベル要素を実装してください */}
      <label htmlFor={name} className="form-field__label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      {/* 【課題22】input要素を実装してください */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-field__input ${showError ? 'form-field__input--error' : ''}`}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />

      {/* 【課題23】エラーメッセージを実装してください */}
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
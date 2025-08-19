import React, { type FC, type ChangeEvent } from "react";

// 【課題33】RadioOptionインターフェースを定義してください
interface RadioOption {
  value: string;
  label: string;
}

// 【課題34】RadioGroupPropsインターフェースを定義してください
interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export const RadioGroup: FC<RadioGroupProps> = ({
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
    <div className="radio-group-field">
      {/* 【課題35】fieldset要素を実装してください */}
      <fieldset
        className="radio-group"
        role="radiogroup"
        aria-invalid={!!showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      >
        {/* 【課題36】legend要素を実装してください */}
        <legend className="radio-group__legend">
          {label}を選択
          {required && <span className="input-field__required">*</span>}
        </legend>

        {/* 【課題37】ラジオボタンのリストを実装してください */}
        <div className="radio-group__options">
          {options.map((option, index) => {
            // 【課題38】ラジオボタンのIDを生成してください
            const radioId = `${name}-${index}`;

            return (
              <div key={option.value} className="radio-option">
                {/* 【課題39】radio input要素を実装してください */}
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="radio-option__input"
                />

                {/* 【課題40】ラジオボタンのラベルを実装してください */}
                <label htmlFor={radioId} className="radio-option__label">
                  <span className="radio-option__radio"></span>
                  <span className="radio-option__text">{option.label}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {showError && (
        <span id={`${name}-error`} className="radio-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

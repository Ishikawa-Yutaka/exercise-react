/**
 * React Form Components - Select Field Component
 * ドロップダウン選択コンポーネント
 */

import type React from 'react'
import type { ChangeEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectFieldProps {
  label: string
  name: string
  value: string
  options: SelectOption[]
  error?: string
  touched?: boolean
  placeholder?: string
  required?: boolean
  disabled?: boolean
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onBlur: () => void
  className?: string
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  className = '',
}) => {
  const hasError = touched && error
  const fieldId = `field-${name}`
  const errorId = `${fieldId}-error`

  return (
    <div className={`input-field ${className}`}>
      <label htmlFor={fieldId} className='input-field__label'>
        {label}
        {required && (
          <span className='input-field__required' aria-label='必須'>
            *
          </span>
        )}
      </label>

      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={`input-field__select ${hasError ? 'input-field__select--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <div id={errorId} className='input-field__error' role='alert'>
          {error}
        </div>
      )}
    </div>
  )
}

export default SelectField

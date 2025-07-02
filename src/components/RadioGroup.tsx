/**
 * React Form Components - Radio Group Component
 * ラジオボタングループコンポーネント
 */

import type React from 'react'
import type { ChangeEvent } from 'react'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

export interface RadioGroupProps {
  label: string
  name: string
  value: string
  options: RadioOption[]
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  className?: string
  inline?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  options,
  error,
  touched,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  className = '',
  inline = false,
}) => {
  const hasError = touched && error
  const groupId = `group-${name}`
  const errorId = `${groupId}-error`

  return (
    <fieldset className={`radio-group ${inline ? 'radio-group--inline' : ''} ${className}`}>
      <legend className='radio-group__legend'>
        {label}
        {required && (
          <span className='radio-group__required' aria-label='必須'>
            *
          </span>
        )}
      </legend>

      <div className='radio-group__options' role='radiogroup' aria-labelledby={groupId}>
        {options.map((option) => {
          const optionId = `${name}-${option.value}`
          const descriptionId = option.description ? `${optionId}-description` : undefined

          return (
            <div key={option.value} className='radio-option'>
              <input
                id={optionId}
                name={name}
                type='radio'
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled || option.disabled}
                className={`radio-option__input ${hasError ? 'radio-option__input--error' : ''}`}
                aria-invalid={hasError}
                aria-describedby={[hasError ? errorId : null, descriptionId].filter(Boolean).join(' ') || undefined}
              />

              <label htmlFor={optionId} className='radio-option__label'>
                <span className='radio-option__radio' aria-hidden='true' />
                <span className='radio-option__text'>{option.label}</span>
              </label>

              {option.description && (
                <div id={descriptionId} className='radio-option__description'>
                  {option.description}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hasError && (
        <div id={errorId} className='radio-group__error' role='alert'>
          {error}
        </div>
      )}
    </fieldset>
  )
}

export default RadioGroup

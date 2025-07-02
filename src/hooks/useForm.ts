/**
 * React Form Components - useForm Hook
 * フォーム状態管理カスタムフック
 */

import { type ChangeEvent, useCallback, useState } from 'react'

export interface FormField {
  value: string
  error?: string
  touched: boolean
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | undefined
}

export interface FormConfig<T extends Record<string, unknown>> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, ValidationRule>>
  onSubmit?: (values: T) => void | Promise<void>
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
  handleChange: (
    name: keyof T,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (name: keyof T) => () => void
  setValue: (name: keyof T, value: string) => void
  setError: (name: keyof T, error: string) => void
  resetForm: () => void
  handleSubmit: (event?: React.FormEvent) => Promise<void>
  validateField: (name: keyof T) => string | undefined
  validateForm: () => boolean
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: FormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (name: keyof T): string | undefined => {
      const value = values[name]
      const rules = validationRules[name]

      if (!rules) return undefined

      // Required validation
      if (rules.required && (!value || value.toString().trim() === '')) {
        return 'この項目は必須です'
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === '') {
        return undefined
      }

      const stringValue = value.toString()

      // MinLength validation
      if (rules.minLength && stringValue.length < rules.minLength) {
        return `${rules.minLength}文字以上で入力してください`
      }

      // MaxLength validation
      if (rules.maxLength && stringValue.length > rules.maxLength) {
        return `${rules.maxLength}文字以内で入力してください`
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(stringValue)) {
        return '形式が正しくありません'
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(stringValue)
      }

      return undefined
    },
    [values, validationRules],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isFormValid = true

    Object.keys(initialValues).forEach((key) => {
      const fieldName = key as keyof T
      const error = validateField(fieldName)
      if (error) {
        newErrors[fieldName] = error
        isFormValid = false
      }
    })

    setErrors(newErrors)
    return isFormValid
  }, [initialValues, validateField])

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0

  const handleChange = useCallback(
    (name: keyof T) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type, checked } = event.target as HTMLInputElement
      const fieldValue = type === 'checkbox' ? checked : value

      setValues((prev) => ({ ...prev, [name]: fieldValue }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      const error = validateField(name)
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [validateField],
  )

  const setValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault()
      }

      setIsSubmitting(true)

      try {
        // Mark all fields as touched
        const allTouched = Object.keys(initialValues).reduce(
          (acc, key) => {
            acc[key as keyof T] = true
            return acc
          },
          {} as Partial<Record<keyof T, boolean>>,
        )
        setTouched(allTouched)

        // Validate form
        if (!validateForm()) {
          return
        }

        // Submit form
        if (onSubmit) {
          await onSubmit(values)
        }
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [initialValues, validateForm, onSubmit, values],
  )

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    setValue,
    setError,
    resetForm,
    handleSubmit,
    validateField,
    validateForm,
  }
}

/**
 * React Form Components - useForm Hook Tests
 * useFormカスタムフックのテスト
 */

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useForm } from '../useForm'

describe('useForm', () => {
  const initialValues = {
    name: '',
    email: '',
    age: '',
  }

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    age: {
      required: true,
      custom: (value: string) => {
        const age = Number.parseInt(value)
        if (Number.isNaN(age)) return '数値を入力してください'
        if (age < 0 || age > 120) return '0-120の範囲で入力してください'
        return undefined
      },
    },
  }

  describe('初期状態', () => {
    it('初期値が正しく設定される', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      expect(result.current.values).toEqual(initialValues)
      expect(result.current.errors).toEqual({})
      expect(result.current.touched).toEqual({})
      expect(result.current.isValid).toBe(false)
      expect(result.current.isSubmitting).toBe(false)
    })
  })

  describe('値の変更', () => {
    it('handleChangeで値が更新される', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'John Doe', type: 'text', checked: false },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('name')(event)
      })

      expect(result.current.values.name).toBe('John Doe')
    })

    it('チェックボックスの値が正しく処理される', () => {
      const initialValuesWithCheckbox = {
        ...initialValues,
        subscribe: false,
      }

      const { result } = renderHook(() =>
        useForm({
          initialValues: initialValuesWithCheckbox,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'on', type: 'checkbox', checked: true },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('subscribe')(event)
      })

      expect(result.current.values.subscribe).toBe(true)
    })

    it('setValueで値が更新される', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.setValue('name', 'Jane Doe')
      })

      expect(result.current.values.name).toBe('Jane Doe')
    })
  })

  describe('バリデーション', () => {
    it('必須フィールドのバリデーションが動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.handleBlur('name')()
      })

      expect(result.current.errors.name).toBe('この項目は必須です')
      expect(result.current.touched.name).toBe(true)
    })

    it('最小文字数のバリデーションが動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'J', type: 'text', checked: false },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('name')(event)
      })

      act(() => {
        result.current.handleBlur('name')()
      })

      expect(result.current.errors.name).toBe('2文字以上で入力してください')
    })

    it('最大文字数のバリデーションが動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'Very Long Name That Exceeds The Maximum Allowed Length', type: 'text', checked: false },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('name')(event)
      })

      act(() => {
        result.current.handleBlur('name')()
      })

      expect(result.current.errors.name).toBe('20文字以内で入力してください')
    })

    it('パターンバリデーションが動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'invalid-email', type: 'text', checked: false },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('email')(event)
      })

      act(() => {
        result.current.handleBlur('email')()
      })

      expect(result.current.errors.email).toBe('形式が正しくありません')
    })

    it('カスタムバリデーションが動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const event = {
          target: { value: 'abc', type: 'text', checked: false },
        } as React.ChangeEvent<HTMLInputElement>
        result.current.handleChange('age')(event)
      })

      act(() => {
        result.current.handleBlur('age')()
      })

      expect(result.current.errors.age).toBe('数値を入力してください')
    })

    it('有効なデータでバリデーションが通る', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setValue('email', 'john@example.com')
        result.current.setValue('age', '25')
      })

      act(() => {
        result.current.handleBlur('name')()
        result.current.handleBlur('email')()
        result.current.handleBlur('age')()
      })

      expect(result.current.errors).toEqual({})
    })

    it('validateFormが正しく動作する', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        const isValid = result.current.validateForm()
        expect(isValid).toBe(false)
      })

      expect(result.current.errors.name).toBe('この項目は必須です')
      expect(result.current.errors.email).toBe('この項目は必須です')
      expect(result.current.errors.age).toBe('この項目は必須です')
    })
  })

  describe('フォーム送信', () => {
    it('有効なフォームで送信が実行される', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setValue('email', 'john@example.com')
        result.current.setValue('age', '25')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: '25',
      })
    })

    it('無効なフォームで送信が実行されない', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit,
        }),
      )

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(onSubmit).not.toHaveBeenCalled()
      expect(result.current.errors.name).toBe('この項目は必須です')
    })

    it('送信中フラグが正しく管理される', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)))

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setValue('email', 'john@example.com')
        result.current.setValue('age', '25')
      })

      const submitPromise = act(async () => {
        return result.current.handleSubmit()
      })

      expect(result.current.isSubmitting).toBe(true)

      await submitPromise

      expect(result.current.isSubmitting).toBe(false)
    })

    it('送信エラーが適切にハンドリングされる', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onSubmit = vi.fn().mockRejectedValue(new Error('送信エラー'))

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setValue('email', 'john@example.com')
        result.current.setValue('age', '25')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error))
      expect(result.current.isSubmitting).toBe(false)

      consoleSpy.mockRestore()
    })
  })

  describe('フォームリセット', () => {
    it('resetFormで全ての状態がリセットされる', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setError('name', 'エラー')
        result.current.handleBlur('name')()
      })

      act(() => {
        result.current.resetForm()
      })

      expect(result.current.values).toEqual(initialValues)
      expect(result.current.errors).toEqual({})
      expect(result.current.touched).toEqual({})
      expect(result.current.isSubmitting).toBe(false)
    })
  })

  describe('isValidフラグ', () => {
    it('エラーがなく、触れたフィールドがある場合にtrueになる', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.setValue('name', 'John Doe')
        result.current.setValue('email', 'john@example.com')
        result.current.setValue('age', '25')
        result.current.handleBlur('name')()
      })

      expect(result.current.isValid).toBe(true)
    })

    it('エラーがある場合にfalseになる', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      act(() => {
        result.current.handleBlur('name')()
      })

      expect(result.current.isValid).toBe(false)
    })

    it('触れたフィールドがない場合にfalseになる', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
        }),
      )

      expect(result.current.isValid).toBe(false)
    })
  })
})

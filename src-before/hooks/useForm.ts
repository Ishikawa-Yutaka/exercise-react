import { type ChangeEvent, useCallback, useState } from 'react'

// バリデーションルールの型定義
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | undefined
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule
}

// useFormフックのオプション
interface UseFormOptions<T> {
  initialValues: T
  validationRules?: ValidationRules<T>
  onSubmit: (values: T) => void | Promise<void>
}

// 【課題1】useFormフックを実装してください
// 要件:
// - ジェネリクスTを使用（T extends Record<string, any>）
// - values、errors、touched、isSubmittingの状態を管理
// - 各種ハンドラーとユーティリティ関数を返す
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions<T>) {
  // 【課題2】フォームの状態を管理するuseStateを実装してください
  // 要件:
  // - values: T型
  // - errors: Partial<Record<keyof T, string>>型
  // - touched: Partial<Record<keyof T, boolean>>型
  // - isSubmitting: boolean型
  const [values, setValues] = useState<T>(/* ここに実装 */)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>(/* ここに実装 */)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(/* ここに実装 */)
  const [isSubmitting, setIsSubmitting] = useState(/* ここに実装 */)

  // 【課題3】単一フィールドのバリデーション関数を実装してください
  // 要件:
  // - フィールド名と値を受け取る
  // - バリデーションルールに基づいてエラーメッセージを返す
  // - エラーがない場合はundefinedを返す
  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      const rules = validationRules?.[name]
      if (!rules) return undefined

      // 【課題4】必須チェックを実装してください
      // 要件:
      // - rules.requiredがtrueで値が空の場合
      // - 文字列の場合はtrimして空文字をチェック
      if (rules.required) {
        /* ここに実装 */
      }

      // 【課題5】最小文字数チェックを実装してください
      // 要件:
      // - rules.minLengthが指定されている場合
      // - 文字列の長さをチェック
      if (rules.minLength && typeof value === 'string') {
        /* ここに実装 */
      }

      // 【課題6】最大文字数チェックを実装してください
      // 要件:
      // - rules.maxLengthが指定されている場合
      // - 文字列の長さをチェック
      if (rules.maxLength && typeof value === 'string') {
        /* ここに実装 */
      }

      // 【課題7】パターンマッチングチェックを実装してください
      // 要件:
      // - rules.patternが指定されている場合
      // - 正規表現でチェック
      if (rules.pattern && typeof value === 'string') {
        /* ここに実装 */
      }

      // 【課題8】カスタムバリデーションを実装してください
      // 要件:
      // - rules.custom関数が指定されている場合
      // - custom関数を実行して結果を返す
      if (rules.custom) {
        /* ここに実装 */
      }

      return undefined
    },
    [validationRules],
  )

  // 【課題9】全フィールドのバリデーション関数を実装してください
  // 要件:
  // - すべてのフィールドをループしてvalidateFieldを実行
  // - エラーがあるフィールドのみを含むオブジェクトを返す
  const validateForm = useCallback((): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {}

    /* ここに実装 */

    return newErrors
  }, [values, validateField])

  // 【課題10】onChange ハンドラーを実装してください
  // 要件:
  // - input要素のname属性からフィールド名を取得
  // - 値を更新
  // - touchedの場合はバリデーションを実行
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const fieldName = name as keyof T

      // 【課題11】チェックボックスの値処理を実装してください
      // 要件:
      // - typeが'checkbox'の場合はchecked属性を使用
      // - それ以外はvalueを使用
      let fieldValue: any
      if (type === 'checkbox') {
        /* ここに実装 */
      } else {
        /* ここに実装 */
      }

      // 値を更新
      setValues((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }))

      // 【課題12】touchedフィールドのバリデーションを実装してください
      // 要件:
      // - touched[fieldName]がtrueの場合のみバリデーション
      // - エラーを更新
      if (touched[fieldName]) {
        /* ここに実装 */
      }
    },
    [touched, validateField],
  )

  // 【課題13】onBlur ハンドラーを実装してください
  // 要件:
  // - フィールドをtouchedに設定
  // - バリデーションを実行してエラーを更新
  const handleBlur = useCallback(
    (name: keyof T) => {
      /* ここに実装 */
    },
    [values, validateField],
  )

  // 【課題14】フォーム送信ハンドラーを実装してください
  // 要件:
  // - デフォルトの送信動作を防ぐ
  // - 全フィールドのバリデーション
  // - エラーがない場合のみonSubmitを実行
  // - isSubmittingの状態管理
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      /* ここに実装 */
    },
    [validateForm, values, onSubmit],
  )

  // 【課題15】フォームリセット関数を実装してください
  // 要件:
  // - すべての状態を初期値に戻す
  const resetForm = useCallback(() => {
    /* ここに実装 */
  }, [initialValues])

  // 【課題16】特定フィールドの値設定関数を実装してください
  // 要件:
  // - フィールド名と値を受け取る
  // - 値を更新
  // - touchedの場合はバリデーション
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      /* ここに実装 */
    },
    [touched, validateField],
  )

  // 【課題17】特定フィールドのエラー設定関数を実装してください
  // 要件:
  // - フィールド名とエラーメッセージを受け取る
  // - エラーを更新
  const setFieldError = useCallback((name: keyof T, error: string) => {
    /* ここに実装 */
  }, [])

  // フォームの有効性チェック
  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}

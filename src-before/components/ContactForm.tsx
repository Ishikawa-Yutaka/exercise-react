import type React from 'react'
import { useForm } from '../hooks/useForm'
import { CheckboxField } from './CheckboxField'
import { InputField } from './InputField'
import { RadioGroup } from './RadioGroup'
import { SelectField } from './SelectField'

// 【課題41】FormDataインターフェースを定義してください
// 要件:
// - name: string
// - email: string
// - subject: string
// - category: string
// - message: string
// - subscribe: boolean
type FormData = {}

export const ContactForm: React.FC = () => {
  // 【課題42】フォームの初期値を定義してください
  // 要件:
  // - 全フィールドの初期値を設定
  // - subscribeはfalse、その他は空文字列
  const initialValues: FormData = {
    /* ここに実装 */
  }

  // 【課題43】バリデーションルールを定義してください
  // 要件:
  // - name: 必須、最小2文字、最大50文字
  // - email: 必須、メールアドレスパターン
  // - subject: 必須
  // - message: 必須、最小10文字、最大500文字
  const validationRules = {
    name: {
      required: true,
      minLength: /* ここに実装 */,
      maxLength: /* ここに実装 */,
    },
    email: {
      required: true,
      pattern: /* ここに実装 - メールアドレスの正規表現 */,
    },
    subject: {
      required: /* ここに実装 */,
    },
    message: {
      required: true,
      minLength: /* ここに実装 */,
      maxLength: /* ここに実装 */,
    },
  };

  // 【課題44】フォーム送信処理を実装してください
  // 要件:
  // - コンソールに'Form submitted'と値を表示
  // - 1秒後にalertで成功メッセージを表示
  // - フォームをリセット
  const handleFormSubmit = async (formData: FormData) => {
    /* ここに実装 */
  }

  // 【課題45】useFormフックを使用してください
  // 要件:
  // - initialValues、validationRules、onSubmitを渡す
  // - 必要な値と関数を取得
  const { values, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit, resetForm } =
    useForm<FormData>({
      /* ここに実装 */
    })

  // カテゴリーオプション
  const categoryOptions = [
    { value: 'general', label: '一般的な質問' },
    { value: 'technical', label: '技術的な質問' },
    { value: 'billing', label: '請求に関する質問' },
    { value: 'other', label: 'その他' },
  ]

  // 件名オプション
  const subjectOptions = [
    { value: 'inquiry', label: 'お問い合わせ' },
    { value: 'feedback', label: 'フィードバック' },
    { value: 'support', label: 'サポート' },
  ]

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <h2>お問い合わせフォーム</h2>

      {/* 【課題46】名前入力フィールドを実装してください
          要件:
          - InputFieldコンポーネントを使用
          - 必須フィールド
          - エラーとタッチ状態を渡す
      */}
      <InputField
        label="お名前"
        name="name"
        value={/* ここに実装 */}
        error={/* ここに実装 */}
        touched={/* ここに実装 */}
        required
        placeholder="山田 太郎"
        onChange={/* ここに実装 */}
        onBlur={() => /* ここに実装 */}
      />

      {/* 【課題47】メールアドレス入力フィールドを実装してください
          要件:
          - InputFieldコンポーネントを使用
          - type="email"
          - 必須フィールド
      */}
      <InputField
        label="メールアドレス"
        name="email"
        type={/* ここに実装 */}
        value={/* ここに実装 */}
        error={/* ここに実装 */}
        touched={/* ここに実装 */}
        required
        placeholder="example@email.com"
        onChange={/* ここに実装 */}
        onBlur={() => /* ここに実装 */}
      />

      {/* 【課題48】件名選択フィールドを実装してください
          要件:
          - RadioGroupコンポーネントを使用
          - subjectOptionsを使用
          - 必須フィールド
      */}
      <RadioGroup
        label="件名"
        name="subject"
        value={/* ここに実装 */}
        options={/* ここに実装 */}
        error={/* ここに実装 */}
        touched={/* ここに実装 */}
        required
        onChange={/* ここに実装 */}
        onBlur={() => /* ここに実装 */}
      />

      {/* カテゴリー選択 */}
      <SelectField
        label="カテゴリー"
        name="category"
        value={values.category}
        options={categoryOptions}
        error={errors.category}
        touched={touched.category}
        onChange={handleChange}
        onBlur={() => handleBlur('category')}
      />

      {/* メッセージ入力 */}
      <div className="form-field">
        <label htmlFor="message" className="form-field__label">
          メッセージ
          <span className="form-field__required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          onBlur={() => handleBlur('message')}
          className={`form-field__textarea ${
            touched.message && errors.message ? 'form-field__textarea--error' : ''
          }`}
          rows={5}
          placeholder="お問い合わせ内容をご記入ください"
          aria-invalid={touched.message && !!errors.message}
          aria-describedby={
            touched.message && errors.message ? 'message-error' : undefined
          }
        />
        {touched.message && errors.message && (
          <span id="message-error" className="form-field__error" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      {/* 【課題49】メールマガジン購読チェックボックスを実装してください
          要件:
          - CheckboxFieldコンポーネントを使用
          - checkedはvalues.subscribe
      */}
      <CheckboxField
        label="メールマガジンを購読する"
        name="subscribe"
        checked={/* ここに実装 */}
        error={/* ここに実装 */}
        touched={/* ここに実装 */}
        onChange={/* ここに実装 */}
        onBlur={() => /* ここに実装 */}
      />

      {/* 【課題50】フォームボタンを実装してください
          要件:
          - 送信ボタン: type="submit"、送信中は無効化、テキスト変更
          - リセットボタン: type="button"、resetForm()を呼ぶ
      */}
      <div className="form-actions">
        <button
          type={/* ここに実装 */}
          disabled={/* ここに実装 */}
          className="button button--primary"
        >
          {/* ここに実装 - 送信中は'送信中...'、それ以外は'送信' */}
        </button>
        <button
          type={/* ここに実装 */}
          onClick={/* ここに実装 */}
          className="button button--secondary"
        >
          リセット
        </button>
      </div>
    </form>
  );
}

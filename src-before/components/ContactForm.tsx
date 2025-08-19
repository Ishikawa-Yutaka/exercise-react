import React, { type FC } from 'react';
import { useForm } from '../hooks/useForm';
import { CheckboxField } from './CheckboxField';
import { InputField } from './InputField';
import { RadioGroup } from './RadioGroup';
import { SelectField } from './SelectField';

// 【課題41】FormDataインターフェースを定義してください
interface FormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  subscribe: boolean;
}

export const ContactForm: FC = () => {
  // 【課題42】フォームの初期値を定義してください
  const initialValues: FormData = {
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    subscribe: false,
  };

  // 【課題43】バリデーションルールを定義してください
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    subject: {
      required: true,
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
  };

  // 【課題44】フォーム送信処理を実装してください
  const handleFormSubmit = async (formData: FormData) => {
    console.log('Form submitted', formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('フォームが正常に送信されました！');
    resetForm();
  };

  // 【課題45】useFormフックを使用してください
  const { values, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit, resetForm } =
    useForm<FormData>({
      initialValues,
      validationRules,
      onSubmit: handleFormSubmit,
    });

  // カテゴリーオプション
  const categoryOptions = [
    { value: 'general', label: '一般的な質問' },
    { value: 'technical', label: '技術的な質問' },
    { value: 'billing', label: '請求に関する質問' },
    { value: 'other', label: 'その他' },
  ];

  // 件名オプション
  const subjectOptions = [
    { value: 'inquiry', label: 'お問い合わせ' },
    { value: 'feedback', label: 'フィードバック' },
    { value: 'support', label: 'サポート' },
  ];

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <h2>お問い合わせフォーム</h2>

      {/* 【課題46】名前入力フィールドを実装してください */}
      <InputField
        label="お名前"
        name="name"
        value={values.name}
        error={errors.name}
        touched={touched.name}
        required
        placeholder="山田 太郎"
        onChange={handleChange}
        onBlur={() => handleBlur('name')}
      />

      {/* 【課題47】メールアドレス入力フィールドを実装してください */}
      <InputField
        label="メールアドレス"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        touched={touched.email}
        required
        placeholder="example@email.com"
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
      />

      {/* 【課題48】件名選択フィールドを実装してください */}
      <RadioGroup
        label="件名"
        name="subject"
        value={values.subject}
        options={subjectOptions}
        error={errors.subject}
        touched={touched.subject}
        required
        onChange={handleChange}
        onBlur={() => handleBlur('subject')}
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

      {/* 【課題49】メールマガジン購読チェックボックスを実装してください */}
      <CheckboxField
        label="メールマガジンを購読する"
        name="subscribe"
        checked={values.subscribe}
        error={errors.subscribe}
        touched={touched.subscribe}
        onChange={handleChange}
        onBlur={() => handleBlur('subscribe')}
      />

      {/* 【課題50】フォームボタンを実装してください */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="button button--primary"
        >
          {isSubmitting ? '送信中...' : '送信'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="button button--secondary"
        >
          リセット
        </button>
      </div>
    </form>
  );
};
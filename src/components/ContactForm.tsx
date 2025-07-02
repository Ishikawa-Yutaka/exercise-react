/**
 * React Form Components - Contact Form
 * カスタムフックを活用したフォーム実装例
 */

import type React from 'react'
import { useForm } from '../hooks/useForm'
import InputField from './InputField'

interface ContactFormData {
  name: string
  email: string
  age: string
  comment: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ContactForm: React.FC = () => {
  const { values, errors, touched, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } =
    useForm<ContactFormData>({
      initialValues: {
        name: '',
        email: '',
        age: '',
        comment: '',
      },
      validationRules: {
        name: {
          required: true,
          minLength: 2,
          maxLength: 20,
        },
        email: {
          required: true,
          pattern: emailRegex,
        },
        age: {
          required: true,
          custom: (value) => {
            const age = Number.parseInt(value)
            if (Number.isNaN(age)) return '数値を入力してください'
            if (age < 0 || age > 120) return '0-120の範囲で入力してください'
            return undefined
          },
        },
        comment: {
          maxLength: 200,
        },
      },
      onSubmit: async (data) => {
        // 実際の送信処理をここに実装
        console.log('フォーム送信データ:', data)

        // 送信のシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert('フォームが正常に送信されました！')
        resetForm()
      },
    })

  return (
    <div className='contact-form'>
      <h2 className='contact-form__title'>お問い合わせフォーム</h2>

      <form onSubmit={handleSubmit} className='contact-form__form' noValidate>
        <InputField
          label='お名前'
          name='name'
          value={values.name}
          error={errors.name}
          touched={touched.name}
          required
          placeholder='山田 太郎'
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
        />

        <InputField
          label='メールアドレス'
          name='email'
          type='email'
          value={values.email}
          error={errors.email}
          touched={touched.email}
          required
          placeholder='example@email.com'
          autoComplete='email'
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />

        <InputField
          label='年齢'
          name='age'
          type='number'
          value={values.age}
          error={errors.age}
          touched={touched.age}
          required
          placeholder='25'
          onChange={handleChange('age')}
          onBlur={handleBlur('age')}
        />

        <div className='input-field'>
          <label htmlFor='field-comment' className='input-field__label'>
            コメント
            <span className='input-field__optional'>（任意）</span>
          </label>

          <textarea
            id='field-comment'
            name='comment'
            value={values.comment}
            placeholder='ご質問やご要望をお聞かせください（200文字以内）'
            onChange={handleChange('comment')}
            onBlur={handleBlur('comment')}
            className={`input-field__textarea ${
              touched.comment && errors.comment ? 'input-field__textarea--error' : ''
            }`}
            rows={4}
            maxLength={200}
            aria-invalid={touched.comment && !!errors.comment}
            aria-describedby={touched.comment && errors.comment ? 'field-comment-error' : undefined}
          />

          <div className='input-field__info'>
            <span className='input-field__counter'>{values.comment.length}/200文字</span>
          </div>

          {touched.comment && errors.comment && (
            <div id='field-comment-error' className='input-field__error' role='alert'>
              {errors.comment}
            </div>
          )}
        </div>

        <div className='contact-form__actions'>
          <button
            type='submit'
            disabled={!isValid || isSubmitting}
            className={`btn btn--primary ${!isValid || isSubmitting ? 'btn--disabled' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className='btn__spinner' aria-hidden='true' />
                送信中...
              </>
            ) : (
              '送信する'
            )}
          </button>

          <button type='button' onClick={resetForm} className='btn btn--secondary' disabled={isSubmitting}>
            リセット
          </button>
        </div>
      </form>

      <div className='contact-form__debug'>
        <details>
          <summary>デバッグ情報</summary>
          <pre>
            <strong>Values:</strong> {JSON.stringify(values, null, 2)}
            <strong>Errors:</strong> {JSON.stringify(errors, null, 2)}
            <strong>Touched:</strong> {JSON.stringify(touched, null, 2)}
            <strong>Is Valid:</strong> {isValid}
            <strong>Is Submitting:</strong> {isSubmitting}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default ContactForm

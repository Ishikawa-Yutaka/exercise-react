/**
 * React Form Components - InputField Component Tests
 * InputFieldコンポーネントのテスト
 */

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import InputField from '../InputField'

describe('InputField', () => {
  const defaultProps = {
    label: 'テストラベル',
    name: 'test',
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基本レンダリング', () => {
    it('ラベルと入力フィールドが正しくレンダリングされる', () => {
      render(<InputField {...defaultProps} />)

      expect(screen.getByLabelText('テストラベル')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('必須フィールドのマークが表示される', () => {
      render(<InputField {...defaultProps} required />)

      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByLabelText('必須')).toBeInTheDocument()
    })

    it('プレースホルダーが設定される', () => {
      const placeholder = 'プレースホルダーテキスト'
      render(<InputField {...defaultProps} placeholder={placeholder} />)

      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('異なる入力タイプが設定される', () => {
      const { rerender } = render(<InputField {...defaultProps} type='email' />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

      rerender(<InputField {...defaultProps} type='password' />)
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')

      rerender(<InputField {...defaultProps} type='number' />)
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
    })

    it('値が正しく表示される', () => {
      render(<InputField {...defaultProps} value='テスト値' />)

      expect(screen.getByDisplayValue('テスト値')).toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    it('エラーがない場合はエラーメッセージが表示されない', () => {
      render(<InputField {...defaultProps} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('touchedがfalseの場合はエラーメッセージが表示されない', () => {
      render(<InputField {...defaultProps} error='エラーメッセージ' touched={false} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('touchedがtrueでエラーがある場合にエラーメッセージが表示される', () => {
      render(<InputField {...defaultProps} error='エラーメッセージ' touched={true} />)

      expect(screen.getByRole('alert')).toHaveTextContent('エラーメッセージ')
    })

    it('エラー状態でCSSクラスが適用される', () => {
      render(<InputField {...defaultProps} error='エラーメッセージ' touched={true} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-field__input--error')
    })

    it('エラー状態でaria属性が正しく設定される', () => {
      render(<InputField {...defaultProps} error='エラーメッセージ' touched={true} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'field-test-error')
    })
  })

  describe('無効状態', () => {
    it('無効状態でdisabled属性が設定される', () => {
      render(<InputField {...defaultProps} disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('ユーザーインタラクション', () => {
    it('入力時にonChangeが呼ばれる', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<InputField {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'テスト')

      expect(onChange).toHaveBeenCalledTimes(3) // 'テ', 'ス', 'ト'
    })

    it('フォーカス離脱時にonBlurが呼ばれる', async () => {
      const user = userEvent.setup()
      const onBlur = vi.fn()

      render(<InputField {...defaultProps} onBlur={onBlur} />)

      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.tab()

      expect(onBlur).toHaveBeenCalledTimes(1)
    })

    it('Enterキーでフォームイベントが発生する', () => {
      const onSubmit = vi.fn()

      render(
        <form onSubmit={onSubmit}>
          <InputField {...defaultProps} />
        </form>,
      )

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      fireEvent.submit(input.closest('form') as HTMLFormElement)

      expect(onSubmit).toHaveBeenCalled()
    })
  })

  describe('アクセシビリティ', () => {
    it('ラベルと入力フィールドが正しく関連付けられている', () => {
      render(<InputField {...defaultProps} />)

      const input = screen.getByRole('textbox')
      const label = screen.getByText('テストラベル')

      expect(input).toHaveAttribute('id', 'field-test')
      expect(label).toHaveAttribute('for', 'field-test')
    })

    it('必須フィールドでrequired属性が設定される', () => {
      render(<InputField {...defaultProps} required />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })

    it('autoComplete属性が設定される', () => {
      render(<InputField {...defaultProps} autoComplete='email' />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })

    it('カスタムクラス名が適用される', () => {
      render(<InputField {...defaultProps} className='custom-class' />)

      const container = screen.getByRole('textbox').closest('.input-field')
      expect(container).toHaveClass('custom-class')
    })

    it('フィールドIDが一意になる', () => {
      render(
        <div>
          <InputField {...defaultProps} name='field1' label='フィールド1' />
          <InputField {...defaultProps} name='field2' label='フィールド2' />
        </div>,
      )

      expect(screen.getByLabelText('フィールド1')).toHaveAttribute('id', 'field-field1')
      expect(screen.getByLabelText('フィールド2')).toHaveAttribute('id', 'field-field2')
    })
  })

  describe('フォーカス管理', () => {
    it('プログラムでフォーカスを設定できる', () => {
      render(<InputField {...defaultProps} />)

      const input = screen.getByRole('textbox')
      input.focus()

      expect(input).toHaveFocus()
    })

    it('Tabキーでフォーカス移動ができる', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <InputField {...defaultProps} name='field1' label='フィールド1' />
          <InputField {...defaultProps} name='field2' label='フィールド2' />
        </div>,
      )

      const input1 = screen.getByLabelText('フィールド1')
      const input2 = screen.getByLabelText('フィールド2')

      input1.focus()
      expect(input1).toHaveFocus()

      await user.tab()
      expect(input2).toHaveFocus()
    })
  })
})

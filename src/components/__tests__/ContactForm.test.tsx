/**
 * React Form Components - ContactForm Integration Tests
 * ContactFormコンポーネントの統合テスト
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactForm from '../ContactForm'

// Alert のモック
Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
})

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本レンダリング', () => {
    it('フォームの全要素が正しくレンダリングされる', () => {
      render(<ContactForm />)

      expect(screen.getByText('お問い合わせフォーム')).toBeInTheDocument()
      expect(screen.getByLabelText('お名前')).toBeInTheDocument()
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByLabelText('年齢')).toBeInTheDocument()
      expect(screen.getByLabelText('コメント（任意）')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '送信する' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument()
    })

    it('初期状態では送信ボタンが無効になっている', () => {
      render(<ContactForm />)

      const submitButton = screen.getByRole('button', { name: '送信する' })
      expect(submitButton).toBeDisabled()
    })

    it('デバッグ情報が表示される', () => {
      render(<ContactForm />)

      expect(screen.getByText('デバッグ情報')).toBeInTheDocument()
    })
  })

  describe('入力値検証', () => {
    it('必須フィールドが空の場合にエラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const nameInput = screen.getByLabelText('お名前')
      await user.click(nameInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('この項目は必須です')).toBeInTheDocument()
      })
    })

    it('名前の文字数制限が機能する', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const nameInput = screen.getByLabelText('お名前')
      await user.type(nameInput, 'A')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('2文字以上で入力してください')).toBeInTheDocument()
      })
    })

    it('メールアドレスの形式検証が機能する', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const emailInput = screen.getByLabelText('メールアドレス')
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('形式が正しくありません')).toBeInTheDocument()
      })
    })

    it('年齢の数値検証が機能する', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const ageInput = screen.getByLabelText('年齢')
      await user.type(ageInput, 'abc')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('数値を入力してください')).toBeInTheDocument()
      })
    })

    it('年齢の範囲検証が機能する', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const ageInput = screen.getByLabelText('年齢')
      await user.type(ageInput, '150')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('0-120の範囲で入力してください')).toBeInTheDocument()
      })
    })

    it('コメントの文字数制限が機能する', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const commentTextarea = screen.getByLabelText('コメント（任意）')
      const longText = 'a'.repeat(201)
      await user.type(commentTextarea, longText)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('200文字以内で入力してください')).toBeInTheDocument()
      })
    })
  })

  describe('フォーム送信', () => {
    it('有効なデータでフォーム送信が成功する', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      render(<ContactForm />)

      // 有効なデータを入力
      await user.type(screen.getByLabelText('お名前'), '山田太郎')
      await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com')
      await user.type(screen.getByLabelText('年齢'), '30')
      await user.type(screen.getByLabelText('コメント（任意）'), 'テストコメント')

      // フィールドをタッチして検証を有効にする
      await user.tab()

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: '送信する' })
        expect(submitButton).not.toBeDisabled()
      })

      // フォーム送信
      const submitButton = screen.getByRole('button', { name: '送信する' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toHaveTextContent('送信中...')
      })

      await waitFor(
        () => {
          expect(window.alert).toHaveBeenCalledWith('フォームが正常に送信されました！')
        },
        { timeout: 2000 },
      )

      expect(consoleSpy).toHaveBeenCalledWith('フォーム送信データ:', {
        name: '山田太郎',
        email: 'yamada@example.com',
        age: '30',
        comment: 'テストコメント',
      })

      consoleSpy.mockRestore()
    })

    it('無効なデータでフォーム送信が阻止される', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const submitButton = screen.getByRole('button', { name: '送信する' })
      await user.click(submitButton)

      // エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getAllByText('この項目は必須です')).toHaveLength(3) // name, email, age
      })

      expect(window.alert).not.toHaveBeenCalled()
    })

    it('送信中は送信ボタンが無効になる', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // 有効なデータを入力
      await user.type(screen.getByLabelText('お名前'), '山田太郎')
      await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com')
      await user.type(screen.getByLabelText('年齢'), '30')
      await user.tab()

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: '送信する' })
        expect(submitButton).not.toBeDisabled()
      })

      const submitButton = screen.getByRole('button', { name: '送信する' })
      await user.click(submitButton)

      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('送信中...')
    })
  })

  describe('フォームリセット', () => {
    it('リセットボタンでフォームがクリアされる', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // データを入力
      await user.type(screen.getByLabelText('お名前'), '山田太郎')
      await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com')
      await user.type(screen.getByLabelText('年齢'), '30')
      await user.type(screen.getByLabelText('コメント（任意）'), 'テストコメント')

      // リセット
      const resetButton = screen.getByRole('button', { name: 'リセット' })
      await user.click(resetButton)

      // フィールドがクリアされていることを確認
      expect(screen.getByLabelText('お名前')).toHaveValue('')
      expect(screen.getByLabelText('メールアドレス')).toHaveValue('')
      expect(screen.getByLabelText('年齢')).toHaveValue('')
      expect(screen.getByLabelText('コメント（任意）')).toHaveValue('')
    })

    it('送信中はリセットボタンが無効になる', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // 有効なデータを入力
      await user.type(screen.getByLabelText('お名前'), '山田太郎')
      await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com')
      await user.type(screen.getByLabelText('年齢'), '30')
      await user.tab()

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: '送信する' })
        expect(submitButton).not.toBeDisabled()
      })

      const submitButton = screen.getByRole('button', { name: '送信する' })
      await user.click(submitButton)

      const resetButton = screen.getByRole('button', { name: 'リセット' })
      expect(resetButton).toBeDisabled()
    })
  })

  describe('文字数カウンター', () => {
    it('コメント欄の文字数が正しく表示される', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const commentTextarea = screen.getByLabelText('コメント（任意）')

      expect(screen.getByText('0/200文字')).toBeInTheDocument()

      await user.type(commentTextarea, 'テスト')
      expect(screen.getByText('3/200文字')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('必須フィールドが適切にマークされている', () => {
      render(<ContactForm />)

      expect(screen.getAllByText('*')).toHaveLength(3) // name, email, age
    })

    it('エラーメッセージにrole="alert"が設定されている', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const nameInput = screen.getByLabelText('お名前')
      await user.click(nameInput)
      await user.tab()

      await waitFor(() => {
        const errorMessage = screen.getByText('この項目は必須です')
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })

    it('テキストエリアにaria属性が適切に設定されている', () => {
      render(<ContactForm />)

      const commentTextarea = screen.getByLabelText('コメント（任意）')
      expect(commentTextarea).toHaveAttribute('maxlength', '200')
    })

    it('フォームにnoValidate属性が設定されている', () => {
      render(<ContactForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('novalidate')
    })
  })
})

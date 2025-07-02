# 10 React フォーム - カスタムフックを活用した実践的なフォーム実装

[GitHub Repository](https://github.com/studying-tech/exercise-react)

React のカスタムフックを活用して、状態管理、バリデーション、アクセシビリティ対応を含む包括的なフォームシステムを構築し、モダンな React 開発の実践的なスキルを学習します。

## この演習で学べること

- React カスタムフックの設計と実装
- TypeScript を活用した型安全なフォーム開発
- リアルタイムバリデーションの実装
- アクセシビリティ対応のベストプラクティス
- React Testing Library を使用したテスト手法

## 演習の目標

再利用可能でアクセシブルなフォームコンポーネントライブラリを作成します。カスタムフック useForm を中心に、実務で即座に活用できる高品質なフォームシステムを実装し、React の高度な機能を習得します。

## 前提条件

- Node.js 18.0 以上
- npm または yarn
- React の基本知識
- TypeScript の基本文法
- HTML/CSS の基礎知識

## クイックスタート

```sh
# 1. ディレクトリに移動
cd repos/10

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev

# 4. ブラウザでアクセス
# http://localhost:3000

# 5. テストの実行
npm test

# 6. テストUIでデバッグ
npm run test:ui
```

## プロジェクト構成

```txt
/
├── src/                        # ソースコード
│   ├── components/             # Reactコンポーネント
│   │   ├── ContactForm.tsx    # メインフォーム例
│   │   ├── InputField.tsx     # 入力フィールド
│   │   ├── SelectField.tsx    # セレクトフィールド
│   │   ├── CheckboxField.tsx  # チェックボックス
│   │   ├── RadioGroup.tsx     # ラジオグループ
│   │   └── __tests__/         # コンポーネントテスト
│   ├── hooks/                  # カスタムフック
│   │   ├── useForm.ts         # メインフォームフック
│   │   └── __tests__/         # フックテスト
│   ├── types/                  # 型定義
│   │   └── form.ts            # フォーム関連の型
│   ├── styles/                 # スタイルシート
│   │   └── global.css         # グローバルCSS
│   ├── test/                   # テスト設定
│   │   └── setup.ts           # Vitest設定
│   ├── App.tsx                # メインアプリ
│   └── main.tsx               # エントリーポイント
├── tests/                      # E2Eテスト
├── dist/                       # ビルド成果物
├── package.json               # パッケージ設定
├── tsconfig.json              # TypeScript設定
├── vite.config.ts             # Vite設定
├── vitest.config.ts           # Vitest設定
└── README.md                  # このファイル
```

## 開発の進め方

### ステップ 1: useForm フックの実装

型安全なフォーム状態管理を行うカスタムフックを作成します。

```ts
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // バリデーションロジック
  const validate = useCallback(() => {
    // 実装
  }, [values, validationRules]);

  // フォームの状態とハンドラを返す
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
```

### ステップ 2: フォームコンポーネントの作成

再利用可能なフォームコンポーネントを実装します。

```ts
// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required,
  onChange,
  onBlur,
}) => {
  const showError = touched && error;

  return (
    <div className='input-field'>
      <label htmlFor={name} className='input-field__label'>
        {label}
        {required && <span className='input-field__required'>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input-field__input ${showError ? 'input-field__input--error' : ''}`}
        aria-invalid={showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <span id={`${name}-error`} className='input-field__error' role='alert'>
          {error}
        </span>
      )}
    </div>
  );
};
```

### ステップ 3: アクセシビリティ対応

ARIA 属性やキーボードナビゲーションを実装し、すべてのユーザーが使いやすいフォームを作成します。

## 必須要件

- [ ] useForm カスタムフックの実装
- [ ] TypeScript による型安全なフォーム状態管理
- [ ] バリデーション機能（必須、文字数、パターン等）
- [ ] エラーハンドリングと表示
- [ ] 再利用可能なフォームコンポーネント
- [ ] アクセシビリティ対応（ARIA 属性、キーボード操作）

## 追加課題（オプション）

- [ ] 包括的な単体テスト（カバレッジ 80%以上）
- [ ] 統合テストの実装
- [ ] パフォーマンス最適化（メモ化、デバウンス）
- [ ] カスタマイズ可能なスタイルシステム
- [ ] フォーム状態の保存（localStorage）
- [ ] 動的フォームフィールドの追加/削除
- [ ] 多言語対応（i18n）

## 採点基準

| 項目             | 配点  | 評価内容                             |
| ---------------- | ----- | ------------------------------------ |
| 機能性           | 40 点 | useForm フックとコンポーネントの実装 |
| 型安全性         | 30 点 | TypeScript の活用と型推論            |
| アクセシビリティ | 20 点 | ARIA 属性、キーボード対応            |
| テスト           | 10 点 | カバレッジとテスト品質               |

## トラブルシューティング

### バリデーションが動作しない

**問題**: ルール定義が不正
**解決方法**:

```ts
// 間違い: 文字列ではなくRegExpを使用
validationRules: {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 正しいRegExp
  }
}
```

### TypeScript の型エラー

**問題**: 型定義と初期値が一致しない
**解決方法**:

- ジェネリクスの型定義を正確に指定
- 初期値のプロパティをすべて含める
- `tsconfig.json`の strict モードを確認

### テストの失敗

**問題**: DOM 要素が見つからない
**解決方法**:

```sh
# テストUIでデバッグ
npm run test:ui

# ロール名で要素を取得
const input = screen.getByRole('textbox', { name: /email/i });
```

## 参考資料

- [React 公式ドキュメント - Hooks](https://ja.react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN - アクセシビリティ](https://developer.mozilla.org/ja/docs/Learn/Accessibility)

## 課題提出方法

1. このリポジトリをフォーク
2. `submission/[あなたの名前]` ブランチを作成
3. React フォームシステムを実装
4. プルリクエストを作成
5. 自動採点の結果を確認
6. 必要に応じて修正

### 詳細な提出手順

#### 1. リポジトリのフォーク

```sh
# GitHub で Fork ボタンをクリック後
git clone https://github.com/[あなたのユーザー名]/exercise-react.git
cd exercise-react
```

#### 2. ブランチ作成

```sh
git checkout -b submission/taro-yamada
```

#### 3. 実装とコミット

```sh
# useFormフックの実装
git add src/hooks/useForm.ts
git commit -m "feat: 型安全なuseFormカスタムフックを実装"

# フォームコンポーネントの作成
git add src/components/
git commit -m "feat: 再利用可能なフォームコンポーネントを作成"

# アクセシビリティ対応
git add src/components/
git commit -m "a11y: ARIA属性とキーボードナビゲーションを実装"

# テストの追加
git add src/**/__tests__/
git commit -m "test: カスタムフックとコンポーネントのテストを追加"
```

#### 4. プッシュと PR 作成

```sh
git push origin submission/taro-yamada
```

GitHub でプルリクエストを作成：

- タイトル: `[提出] 演習10: Reactフォーム - 山田太郎`
- 本文: 実装した機能とアクセシビリティ対応を記載

## 開発のヒント

### カスタムフックの設計

- 状態管理ロジックの分離
- ジェネリクスによる型安全性
- パフォーマンスを考慮した実装

### アクセシビリティのポイント

- すべてのフォーム要素に ID とラベルを関連付け
- エラーメッセージに aria-live を設定
- キーボードのみでの操作を保証

### テストの書き方

```ts
// ユーザー目線でのテスト
const user = userEvent.setup();
const input = screen.getByLabelText('メールアドレス');
await user.type(input, 'test@example.com');
```

頑張ってアクセシブルで使いやすいフォームを作成してください！

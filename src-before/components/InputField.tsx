import type React from 'react'

// 【課題18】InputFieldPropsインターフェースを定義してください
// 要件:
// - label: string (必須)
// - name: string (必須)
// - type?: 'text' | 'email' | 'password' | 'tel' | 'number' (オプション、デフォルト'text')
// - value: string | number (必須)
// - error?: string (オプション)
// - touched?: boolean (オプション)
// - required?: boolean (オプション)
// - placeholder?: string (オプション)
// - onChange: (e: React.ChangeEvent<HTMLInputElement>) => void (必須)
// - onBlur: () => void (必須)
type InputFieldProps = {}

// 【課題19】InputFieldコンポーネントを実装してください
// 要件:
// - React.FCを使用
// - エラー表示は touched && error の場合のみ
export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required,
  placeholder,
  onChange,
  onBlur,
}) => {
  // 【課題20】エラー表示条件を実装してください
  // 要件:
  // - touchedがtrueかつerrorが存在する場合にtrue
  const showError = /* ここに実装 */;

  return (
    <div className="form-field">
      {/* 【課題21】ラベル要素を実装してください
          要件:
          - htmlFor属性でinput要素と関連付け
          - 必須フィールドの場合は * を表示
      */}
      <label /* ここに実装 */>
        {label}
        {/* ここに実装 - 必須マーク */}
      </label>

      {/* 【課題22】input要素を実装してください
          要件:
          - id属性をnameと同じにする
          - エラー時はinput--errorクラスを追加
          - aria-invalid属性でエラー状態を示す
          - aria-describedby属性でエラーメッセージと関連付け
      */}
      <input
        id={/* ここに実装 */}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-field__input ${/* ここに実装 - エラー時のクラス */}`}
        aria-invalid={/* ここに実装 */}
        aria-describedby={/* ここに実装 */}
      />

      {/* 【課題23】エラーメッセージを実装してください
          要件:
          - showErrorがtrueの場合のみ表示
          - id属性を{name}-errorにする
          - role="alert"を追加
      */}
      {showError && (
        <span
          id={/* ここに実装 */}
          className="form-field__error"
          role={/* ここに実装 */}
        >
          {error}
        </span>
      )}
    </div>
  );
}

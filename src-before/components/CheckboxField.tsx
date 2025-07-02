import type React from 'react'

// 【課題30】CheckboxFieldPropsインターフェースを定義してください
// 要件:
// - label: string (必須)
// - name: string (必須)
// - checked: boolean (必須)
// - error?: string (オプション)
// - touched?: boolean (オプション)
// - onChange: (e: React.ChangeEvent<HTMLInputElement>) => void (必須)
// - onBlur: () => void (必須)
type CheckboxFieldProps = {}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  const showError = touched && error

  return (
    <div className="form-field form-field--checkbox">
      <div className="checkbox-wrapper">
        {/* 【課題31】checkbox input要素を実装してください
            要件:
            - type="checkbox"
            - id属性をnameと同じにする
            - checked属性を設定
            - aria-invalid属性でエラー状態を示す
            - aria-describedby属性でエラーメッセージと関連付け
        */}
        <input
          type={/* ここに実装 */}
          id={/* ここに実装 */}
          name={name}
          checked={/* ここに実装 */}
          onChange={onChange}
          onBlur={() => onBlur()}
          className="checkbox-wrapper__input"
          aria-invalid={/* ここに実装 */}
          aria-describedby={/* ここに実装 */}
        />

        {/* 【課題32】チェックボックスのラベルを実装してください
            要件:
            - htmlFor属性でinput要素と関連付け
            - クリック可能な領域を広げる
        */}
        <label
          htmlFor={/* ここに実装 */}
          className="checkbox-wrapper__label"
        >
          {label}
        </label>
      </div>

      {showError && (
        <span
          id={`${name}-error`}
          className="form-field__error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

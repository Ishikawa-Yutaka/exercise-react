import type React from 'react'

// 【課題24】SelectOptionインターフェースを定義してください
// 要件:
// - value: string (必須)
// - label: string (必須)
type SelectOption = {}

// 【課題25】SelectFieldPropsインターフェースを定義してください
// 要件:
// - label: string (必須)
// - name: string (必須)
// - value: string (必須)
// - options: SelectOption[] (必須)
// - error?: string (オプション)
// - touched?: boolean (オプション)
// - required?: boolean (オプション)
// - onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void (必須)
// - onBlur: () => void (必須)
type SelectFieldProps = {}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  error,
  touched,
  required,
  onChange,
  onBlur,
}) => {
  const showError = touched && error

  return (
    <div className="form-field">
      {/* 【課題26】ラベル要素を実装してください
          要件:
          - htmlFor属性でselect要素と関連付け
          - 必須フィールドの場合は * を表示
      */}
      <label htmlFor={name} className="form-field__label">
        {label}
        {/* ここに実装 - 必須マーク */}
      </label>

      {/* 【課題27】select要素を実装してください
          要件:
          - id属性をnameと同じにする
          - エラー時はselect--errorクラスを追加
          - aria-invalid属性でエラー状態を示す
          - aria-describedby属性でエラーメッセージと関連付け
      */}
      <select
        id={/* ここに実装 */}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={() => onBlur()}
        className={`form-field__select ${/* ここに実装 - エラー時のクラス */}`}
        aria-invalid={/* ここに実装 */}
        aria-describedby={/* ここに実装 */}
      >
        {/* 【課題28】デフォルトオプションを実装してください
            要件:
            - value=""
            - 「選択してください」というテキスト
        */}
        <option /* ここに実装 */>選択してください</option>

        {/* 【課題29】オプションリストを実装してください
            要件:
            - options配列をmapで展開
            - keyとvalueにoption.valueを使用
            - 表示テキストはoption.label
        */}
        {options.map((option) => (
          <option /* ここに実装 */>
            {/* ここに実装 */}
          </option>
        ))}
      </select>

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

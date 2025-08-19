// src-before/components/__tests__/CheckboxField.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CheckboxField } from "../CheckboxField";

expect(document.body).toBeInTheDocument();

describe("CheckboxField", () => {
  const baseProps = {
    label: "メールマガジンを購読する",
    name: "subscribe",
    checked: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("基本レンダリング", () => {
    it("ラベルとチェックボックスが表示される（id/for は name を使用）", () => {
      render(<CheckboxField {...baseProps} />);

      // アクセシブルネームは label のテキスト
      const checkbox = screen.getByRole("checkbox", {
        name: "メールマガジンを購読する",
      });
      expect(checkbox).toBeInTheDocument();

      // id/for が name に一致
      expect(checkbox).toHaveAttribute("id", "subscribe");
      const label = screen
        .getByText("メールマガジンを購読する")
        .closest("label")!;
      expect(label).toHaveAttribute("for", "subscribe");
    });

    it("チェックマークとテキスト用のspanが存在する", () => {
      render(<CheckboxField {...baseProps} />);
      // マークアップの存在確認（クラス名ベース）
      expect(document.querySelector(".checkbox-field__checkmark")).toBeTruthy();
      expect(document.querySelector(".checkbox-field__text")).toBeTruthy();
    });
  });

  describe("エラー表示/ARIA", () => {
    it("touched=false または error 未指定のときはエラー非表示 & aria-invalid=false & aria-describedbyなし", () => {
      const { rerender } = render(
        <CheckboxField
          {...baseProps}
          error="この項目は必須です"
          touched={false}
        />
      );
      let checkbox = screen.getByRole("checkbox");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(checkbox).toHaveAttribute("aria-invalid", "false");
      expect(checkbox).not.toHaveAttribute("aria-describedby");

      // error 未指定
      rerender(<CheckboxField {...baseProps} touched />);
      checkbox = screen.getByRole("checkbox");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(checkbox).toHaveAttribute("aria-invalid", "false");
      expect(checkbox).not.toHaveAttribute("aria-describedby");
    });

    it("touched=true かつ error ありでエラー表示 & aria 属性が設定される（idは `${name}-error`）", () => {
      render(
        <CheckboxField {...baseProps} error="この項目は必須です" touched />
      );
      const checkbox = screen.getByRole("checkbox");
      const err = screen.getByRole("alert");

      expect(err).toHaveTextContent("この項目は必須です");
      expect(err).toHaveAttribute("id", "subscribe-error");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      expect(checkbox).toHaveAttribute("aria-describedby", "subscribe-error");
    });
  });

  describe("ユーザー操作", () => {
    it("チェック/アンチェックできる（Wrapperで制御）", async () => {
      const user = userEvent.setup();

      const Wrapper = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <CheckboxField
            {...baseProps}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        );
      };

      render(<Wrapper />);

      const cb = screen.getByRole("checkbox");
      expect(cb).not.toBeChecked();

      await user.click(cb);
      expect(cb).toBeChecked();

      await user.click(cb);
      expect(cb).not.toBeChecked();
    });

    it("onChange / onBlur が呼ばれる", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onBlur = vi.fn();

      render(
        <CheckboxField {...baseProps} onChange={onChange} onBlur={onBlur} />
      );

      const cb = screen.getByRole("checkbox");

      await user.click(cb);
      expect(onChange).toHaveBeenCalledTimes(1);

      cb.focus();
      await user.tab(); // フォーカスアウト
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});

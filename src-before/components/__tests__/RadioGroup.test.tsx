// src-before/components/__tests__/RadioGroup.test.tsx
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { RadioGroup } from "../RadioGroup";

describe("RadioGroup", () => {
  const options = [
    { value: "inquiry", label: "お問い合わせ" },
    { value: "feedback", label: "フィードバック" },
    { value: "support", label: "サポート" },
  ];

  const baseProps = {
    label: "件名",
    name: "subject",
    value: "",
    options,
    onChange: () => {},
    onBlur: () => {},
    required: true,
    touched: false as boolean | undefined,
    error: undefined as string | undefined,
  };

  describe("基本レンダリング", () => {
    it('radiogroup と legend（"件名を選択" + 必要なら *）が表示される', () => {
      render(<RadioGroup {...baseProps} />);

      const group = screen.getByRole("radiogroup");
      expect(group).toBeInTheDocument();

      // 実装は「{label}を選択」なので空白は入らない想定（改行対策で \s* を許容）
      expect(screen.getByText(/件名\s*を選択/)).toBeInTheDocument();

      // オプションが3つ表示
      const withinGroup = within(group);
      expect(withinGroup.getByLabelText("お問い合わせ")).toBeInTheDocument();
      expect(withinGroup.getByLabelText("フィードバック")).toBeInTheDocument();
      expect(withinGroup.getByLabelText("サポート")).toBeInTheDocument();
    });

    it("required の場合は * が legend 内に表示される", () => {
      render(<RadioGroup {...baseProps} required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("各 input の id は `${name}-${index}`、label の for と一致する", () => {
      render(<RadioGroup {...baseProps} />);
      options.forEach((_, index) => {
        const id = `subject-${index}`;
        const input = screen.getByRole("radio", { name: options[index].label });
        expect(input).toHaveAttribute("id", id);

        // label は .radio-option__label で for が設定されている
        const label = input.closest(".radio-option")!.querySelector("label")!;
        expect(label).toHaveAttribute("for", id);
      });
    });
  });

  describe("エラー表示", () => {
    it("touched=false ではエラー非表示 & aria-invalid=false & aria-describedbyなし", () => {
      render(
        <RadioGroup {...baseProps} error="この項目は必須です" touched={false} />
      );

      const group = screen.getByRole("radiogroup");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(group).toHaveAttribute("aria-invalid", "false");
      expect(group).not.toHaveAttribute("aria-describedby");
    });

    it("touched=true かつ error ありでエラー表示 & aria 属性設定", () => {
      render(<RadioGroup {...baseProps} error="この項目は必須です" touched />);

      const group = screen.getByRole("radiogroup");
      const err = screen.getByRole("alert");

      expect(err).toHaveTextContent("この項目は必須です");
      expect(err).toHaveAttribute("id", "subject-error");
      expect(group).toHaveAttribute("aria-invalid", "true");
      expect(group).toHaveAttribute("aria-describedby", "subject-error");
    });
  });

  describe("ユーザー操作", () => {
    it("ラジオを選択できる", async () => {
      const user = userEvent.setup();

      // Wrapper で state を管理して onChange 時に更新する
      const Wrapper = () => {
        const [val, setVal] = React.useState("");
        return (
          <RadioGroup
            {...baseProps}
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      };

      render(<Wrapper />);
      const radio = screen.getByLabelText("フィードバック") as HTMLInputElement;

      await user.click(radio);
      expect(radio.checked).toBe(true);
    });

    it("onChange / onBlur が呼ばれる", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onBlur = vi.fn();

      render(<RadioGroup {...baseProps} onChange={onChange} onBlur={onBlur} />);

      const radio = screen.getByLabelText("お問い合わせ");
      await user.click(radio);
      expect(onChange).toHaveBeenCalledTimes(1);

      // フォーカス当ててから Tab でフォーカスアウトさせる
      (radio as HTMLElement).focus();
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});

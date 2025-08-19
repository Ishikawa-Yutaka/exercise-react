import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField } from "../SelectField";

describe("SelectField", () => {
  const defaultProps = {
    label: "お問い合わせ区分",
    name: "inquiryType",
    value: "",
    options: [
      { value: "billing", label: "請求について" },
      { value: "technical", label: "技術サポート" },
      { value: "other", label: "その他" },
    ],
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本レンダリング", () => {
    it('label（"〜を選択"）と select が表示される（id/for は name を使用）', () => {
      render(<SelectField {...defaultProps} />);
      const label = screen.getByText("お問い合わせ区分を選択");
      const select = screen.getByRole("combobox");
      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
      expect(label).toHaveAttribute("for", defaultProps.name);
      expect(select).toHaveAttribute("id", defaultProps.name);
    });

    it("required の場合は * がラベル内に表示される（select に required 属性は付与しない実装）", () => {
      render(<SelectField {...defaultProps} required />);
      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      const select = screen.getByRole("combobox");
      expect(select).not.toHaveAttribute("required");
    });

    it("デフォルトオプション「選択してください」と各オプションが表示される", () => {
      render(<SelectField {...defaultProps} />);
      expect(
        screen.getByRole("option", { name: "選択してください" })
      ).toBeInTheDocument();
      defaultProps.options.forEach((opt) => {
        expect(
          screen.getByRole("option", { name: opt.label })
        ).toBeInTheDocument();
      });
    });

    it("現在値が正しく反映される", () => {
      render(<SelectField {...defaultProps} value="technical" />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("technical");
    });
  });

  describe("エラー表示 / ARIA 属性", () => {
    it("touched=false または error 未指定のときはエラー非表示 & aria-invalid=false & aria-describedbyなし", () => {
      render(<SelectField {...defaultProps} />);
      const select = screen.getByRole("combobox");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(select).toHaveAttribute("aria-invalid", "false");
      expect(select).not.toHaveAttribute("aria-describedby");
    });

    it("touched=true かつ error ありでエラー表示 & aria 属性が設定される（idは `${name}-error`）", () => {
      render(<SelectField {...defaultProps} error="必須項目です" touched />);
      const errorEl = screen.getByRole("alert");
      expect(errorEl).toHaveTextContent("必須項目です");
      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("aria-invalid", "true");
      expect(select).toHaveAttribute(
        "aria-describedby",
        `${defaultProps.name}-error`
      );
    });
  });

  describe("ユーザー操作", () => {
    it("選択すると onChange が呼ばれ、値が変わる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const Wrapper: React.FC = () => {
        const [val, setVal] = useState("");
        return (
          <SelectField
            {...defaultProps}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              handleChange(e);
            }}
          />
        );
      };

      render(<Wrapper />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;

      await user.selectOptions(select, "billing");
      expect(handleChange).toHaveBeenCalled();
      expect(select.value).toBe("billing");

      await user.selectOptions(select, "technical");
      expect(select.value).toBe("technical");
    });

    it("フォーカス離脱で onBlur が呼ばれる", async () => {
      const user = userEvent.setup();
      render(<SelectField {...defaultProps} />);
      const select = screen.getByRole("combobox");
      await user.click(select);
      await user.tab();
      expect(defaultProps.onBlur).toHaveBeenCalled();
    });
  });
});

// src-before/hooks/__tests__/useForm.test.ts
/**
 * React Form Hooks - useForm Hook Tests (for your current implementation)
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "../useForm";

describe("useForm (current API)", () => {
  type Values = { name: string; email: string; subscribe: boolean };

  const initialValues: Values = { name: "", email: "", subscribe: false };

  const validationRules = {
    name: { required: true, minLength: 2, maxLength: 20 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  } as const;

  const makeHook = (opts?: Partial<Parameters<typeof useForm<Values>>[0]>) =>
    renderHook(() =>
      useForm<Values>({
        initialValues,
        validationRules,
        onSubmit: vi.fn(),
        ...opts,
      })
    );

  // ────────────────────────────────────────────────────────────────
  // 初期状態
  // ────────────────────────────────────────────────────────────────
  describe("初期状態", () => {
    it("初期値/エラー/touched/isSubmitting/isValid が正しい", () => {
      const { result } = makeHook();
      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      // 実装は errors が空なら true
      expect(result.current.isValid).toBe(true);
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 値の変更
  // ────────────────────────────────────────────────────────────────
  describe("値の変更", () => {
    it("handleChange でテキスト値が更新される（name）", () => {
      const { result } = makeHook();
      act(() => {
        const event = {
          target: { name: "name", value: "John Doe", type: "text" },
        } as any;
        result.current.handleChange(event);
      });
      expect(result.current.values.name).toBe("John Doe");
    });

    it("チェックボックスの値が正しく処理される（subscribe）", () => {
      const { result } = makeHook();
      act(() => {
        const event = {
          target: { name: "subscribe", type: "checkbox", checked: true },
        } as any;
        result.current.handleChange(event);
      });
      expect(result.current.values.subscribe).toBe(true);
    });

    it("setFieldValue で値が更新される", () => {
      const { result } = makeHook();
      act(() => {
        result.current.setFieldValue("name", "Jane");
      });
      expect(result.current.values.name).toBe("Jane");
    });
  });

  // ────────────────────────────────────────────────────────────────
  // バリデーション
  // ────────────────────────────────────────────────────────────────
  describe("バリデーション", () => {
    it("必須フィールド: 空で blur するとエラーになる（name）", () => {
      const { result } = makeHook();
      act(() => {
        result.current.handleBlur("name");
      });
      expect(result.current.errors.name).toBe("この項目は必須です");
      expect(result.current.touched.name).toBe(true);
    });

    it("最小文字数: 1文字 -> 2文字以上のエラー", () => {
      const { result } = makeHook();
      act(() => {
        result.current.setFieldValue("name", "J"); // 値更新
      });
      act(() => {
        result.current.handleBlur("name"); // 別の act で blur
      });
      expect(result.current.errors.name).toBe("2文字以上で入力してください");
    });

    it("最大文字数: 超過でエラー", () => {
      const { result } = makeHook();
      act(() => {
        result.current.setFieldValue("name", "Very Very Very Long Name");
      });
      act(() => {
        result.current.handleBlur("name");
      });
      expect(result.current.errors.name).toBe("20文字以内で入力してください");
    });

    it("パターン: 不正な email でエラー", () => {
      const { result } = makeHook();
      act(() => {
        result.current.setFieldValue("email", "invalid");
      });
      act(() => {
        result.current.handleBlur("email");
      });
      expect(result.current.errors.email).toBe("形式が正しくありません");
    });

    it("（公開API準拠）送信で必須エラーが集約される", async () => {
      const onSubmit = vi.fn();
      const { result } = makeHook({ onSubmit });

      const evt = { preventDefault: vi.fn() } as any;
      await act(async () => {
        await result.current.handleSubmit(evt);
      });

      // 必須エラーが乗っていること
      expect(result.current.errors.name).toBe("この項目は必須です");
      expect(result.current.errors.email).toBe("この項目は必須です");
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("有効データでエラーが消える", () => {
      const { result } = makeHook();

      act(() => {
        result.current.setFieldValue("name", "John Doe");
        result.current.setFieldValue("email", "john@example.com");
      });

      act(() => {
        result.current.handleBlur("name");
        result.current.handleBlur("email");
      });

      expect(result.current.errors).toEqual({});
    });
  });

  // ────────────────────────────────────────────────────────────────
  // フォーム送信
  // ────────────────────────────────────────────────────────────────
  describe("フォーム送信", () => {
    it("有効なフォームで onSubmit が呼ばれる（送信後は isSubmitting=false）", async () => {
      const onSubmit = vi.fn(() => new Promise<void>((r) => setTimeout(r, 0)));
      const { result } = makeHook({ onSubmit });

      act(() => {
        result.current.setFieldValue("name", "John Doe");
        result.current.setFieldValue("email", "john@example.com");
      });

      const evt = { preventDefault: vi.fn() } as any;

      await act(async () => {
        await result.current.handleSubmit(evt);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        subscribe: false,
      });
      expect(result.current.isSubmitting).toBe(false);
      // Submit 時に全フィールド touched 化される
      expect(result.current.touched).toEqual({
        name: true,
        email: true,
        subscribe: true,
      });
    });

    it("無効なフォームでは onSubmit が呼ばれない", async () => {
      const onSubmit = vi.fn();
      const { result } = makeHook({ onSubmit });

      const evt = { preventDefault: vi.fn() } as any;
      await act(async () => {
        await result.current.handleSubmit(evt);
      });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.name).toBe("この項目は必須です");
    });

    it("送信エラーが発生しても isSubmitting は false に戻る", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("送信エラー"));
      const { result } = makeHook({ onSubmit });

      act(() => {
        result.current.setFieldValue("name", "John Doe");
        result.current.setFieldValue("email", "john@example.com");
      });

      const evt = { preventDefault: vi.fn() } as any;
      await act(async () => {
        try {
          await result.current.handleSubmit(evt);
        } catch {}
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  // ────────────────────────────────────────────────────────────────
  // リセット / エラー操作 / isValid
  // ────────────────────────────────────────────────────────────────
  describe("ユーティリティ", () => {
    it("resetForm で全ての状態が初期化される", () => {
      const { result } = makeHook();

      act(() => {
        result.current.setFieldValue("name", "X");
        result.current.setFieldError("name", "エラー");
        result.current.handleBlur("name");
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isValid).toBe(true);
    });

    it("setFieldError でエラーを直接設定できる（isValid=false になる）", () => {
      const { result } = makeHook();

      act(() => {
        result.current.setFieldError("email", "直接設定エラー");
      });

      expect(result.current.errors.email).toBe("直接設定エラー");
      expect(result.current.isValid).toBe(false);
    });
  });
});

import { ContactForm } from "./components/ContactForm";
import { FC } from "react";

// 【課題51】Appコンポーネントを実装してください
export const App: FC = () => {
  return (
    <div className="app">
      {/* 【課題52】ヘッダーセクションを実装してください */}
      <header className="app__header">
        <div className="container">
          <h1>React課題</h1>
          <p>カスタムフックとコンポーネントを使用したフォーム実装</p>
        </div>
      </header>

      {/* 【課題53】メインセクションを実装してください */}
      <main className="app__main">
        <div className="container">
          <ContactForm />
        </div>
      </main>

      {/* フィーチャーセクション */}
      <section className="features-section">
        <div className="container">
          <h2>主な機能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔍 バリデーション</h3>
              <p>リアルタイムでフォーム入力を検証</p>
            </div>
            <div className="feature-card">
              <h3>♿ アクセシビリティ</h3>
              <p>ARIA属性とキーボード操作に対応</p>
            </div>
            <div className="feature-card">
              <h3>🔒 型安全</h3>
              <p>TypeScriptによる完全な型サポート</p>
            </div>
            <div className="feature-card">
              <h3>♻️ 再利用可能</h3>
              <p>カスタムフックとコンポーネント設計</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="app__footer">
        <div className="container">
          <p>&copy; 2024 React Form Components - 学習目的で作成</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

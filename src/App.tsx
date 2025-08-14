/**
 * React Form Components - Main Application
 * カスタムフックを活用したフォーム実装 - メインアプリケーション
 */

import ContactForm from "./components/ContactForm";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="container">
          <h1 className="app__title">React フォームコンポーネント</h1>
          <p className="app__subtitle">
            useFormカスタムフックを活用した実践的なフォーム実装
          </p>
        </div>
      </header>

      <main className="app__main">
        <div className="container">
          <section className="demo-section">
            <ContactForm />
          </section>

          {/* <section className='features-section'>
            <h2 className='features-section__title'>実装機能</h2>
            <div className='features-grid'>
              <div className='feature-card'>
                <h3 className='feature-card__title'>バリデーション</h3>
                <p className='feature-card__description'>リアルタイムでの入力値検証とエラーメッセージ表示</p>
              </div>

              <div className='feature-card'>
                <h3 className='feature-card__title'>アクセシビリティ</h3>
                <p className='feature-card__description'>ARIA属性とキーボードナビゲーションの完全対応</p>
              </div>

              <div className='feature-card'>
                <h3 className='feature-card__title'>型安全性</h3>
                <p className='feature-card__description'>TypeScriptによる完全な型チェックとIntelliSense</p>
              </div>

              <div className='feature-card'>
                <h3 className='feature-card__title'>再利用性</h3>
                <p className='feature-card__description'>カスタムフックによるロジックの分離と再利用</p>
              </div>
            </div>
          </section> */}
        </div>
      </main>

      <footer className="app__footer">
        <div className="container">
          <p>&copy; 2024 React Form Components - 学習目的で作成</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

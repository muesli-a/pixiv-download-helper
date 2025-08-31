# GEMINI.md - Chrome Extension Project Rules

これは Coding AI が参照する Coding Guidlines です。

## General Principles (一般原則)

- **Simplicity (簡潔性)**: 指示のない限り、追加のパラメータや機能は実装しません。
- **Consistency (一貫性)**: 既存のコードベースの設計思想やパターンを正確に踏襲します。
- **Modernity (現代性)**: Manifest V3 に準拠し、公式に非推奨 (deprecated) とされているAPIや実装は使用しません。

## Environment & Dependencies (環境と依存関係)

- **Package Management (パッケージ管理)**: パッケージのインストールや削除は行いません。依存関係の管理はすべてユーザーが `package.json` を介して手動で行うものとします。
- **Build Process (ビルドプロセス)**: すべてのビルドやコンパイルは `package.json` に定義された `scripts` を介して実行します。(例: `npm run build`)
- **Console Output (コンソール出力)**: ビルドプロセスなど、時間を要する可能性があるタスクには、ユーザーからの**指示がない場合でも、進捗状況をコンソールに表示します**。その際、外部ライブラリは導入せず、`console.log` を用いた簡易的な実装とします。

## Coding Style (コーディングスタイル)

- **Language (言語)**: TypeScript を使用し、すべてのコードに型定義を付与します。
- **Docstrings (ドキュメントコメント)**: すべての公開されている関数およびメソッドには、JSDoc形式のコメントを記述します。コメントには、要約、`@param`、`@returns` を必ず含めます。
- **Function Design (関数設計)**: 関数は単一責任の原則に基づき、小さく、責務が明確になるように設計します。
- **Resource Paths (リソースパス)**: 拡張機能内部のリソース（画像、CSSなど）へのパスは、常に相対パスで指定します。スクリプトからリソースURLを取得する必要がある場合は `chrome.runtime.getURL()` を使用します。

## Scope & Limitations (スコープと制限事項)

- **Environment Variables (環境変数)**: `.env` ファイルはAIのコンテキストから除外されていますが、ビルド環境には常に存在するものとして動作を想定します。
- **Prohibited Implementations (禁止事項)**: テストコードの作成は行いません。
- **Asynchronous Processing (非同期処理)**: Chrome拡張機能のAPIは本質的に非同期であるため、`Promise` ベースの非同期処理は積極的に使用します。`async/await` 構文を活用し、可読性の高いコードを記述します。
- **API Requests (APIリクエスト)**: 外部APIへリクエストを行う際は、各リクエストの間に必ず1秒以上の待機時間を設けます。ただし、対象APIのレートリミットがより厳しい場合は、その規定に準拠します。
- **Problem-Solving Attempts (問題解決の試行)**: 同一の課題解決に3回失敗した場合は、それ以上の試行を中止し、ユーザーに指示を仰ぎます。

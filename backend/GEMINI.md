# GEMINI.md - Python Project Rules

これは Coding AI が参照する Coding Guidlines です。

## General Principles (一般原則)

- **Simplicity (簡潔性)**: 指示のない限り、追加のパラメータや機能は実装しません。
- **Consistency (一貫性)**: 既存のコードベースの設計思想やパターンを正確に踏襲します。
- **Modernity (現代性)**: 公式に非推奨 (deprecated) とされている実装やライブラリは使用しません。

## Environment & Dependencies (環境と依存関係)

- **Package Management (パッケージ管理)**: パッケージのインストールや削除は行いません。依存関係の管理はすべてユーザーが手動で行うものとします。
- **Execution (スクリプト実行)**: すべてのスクリプトは `uv run` コマンドを介して実行します。
- **Console Output (コンソール出力)**: ループ処理やAPIの連続実行など、時間を要する可能性があるタスクには、ユーザーからの**指示がない場合でも、進捗状況をコンソールに表示します**。その際、`tqdm`のような外部ライブラリは導入せず、`print`関数とキャリッジリターン (`\r`) を用いた依存関係を追加しない簡易的な実装とします。

## Coding Style (コーディングスタイル)

- **Type Hinting (型ヒント)**: すべてのコードに型ヒントを付与します。
- **Docstrings (ドキュメント文字列)**: すべての公開されている関数およびメソッドには、Googleスタイルに準拠したDocstringを記述します。Docstringには、要約、引数 (Args)、戻り値 (Returns) を必ず含めます。
- **Function Design (関数設計)**: 関数は単一責任の原則に基づき、小さく、責務が明確になるように設計します。
- **File Paths (ファイルパス)**: ファイルパスの操作には、OS間の互換性を考慮し、常に `pathlib.Path` オブジェクトを使用します。

## Scope & Limitations (スコープと制限事項)

- **Environment Variables (環境変数)**: `.env` ファイルはAIのコンテキストから除外されていますが、ローカル環境には常に存在するものとして動作を想定します。
- **Prohibited Implementations (禁止事項)**: テストコードの作成、および非同期・並列・並行処理の実装は行いません。
- **API Requests (APIリクエスト)**: 外部APIへリクエストを行う際は、各リクエストの間に必ず1秒以上の待機時間を設けます。ただし、対象APIのレートリミットがより厳しい場合は、その規定に準拠します。
- **Problem-Solving Attempts (問題解決の試行)**: 同一の課題解決に3回失敗した場合は、それ以上の試行を中止し、ユーザーに指示を仰ぎます。

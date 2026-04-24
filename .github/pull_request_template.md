## 概要

<!-- 変更内容の概要 -->
<!-- 例:
Slack への脆弱性情報投稿をスレッド形式に対応しました。
Slack Web API (chat.postMessage) を使用し、メインメッセージに要約一覧、スレッド返信に各脆弱性の詳細を投稿する形式になります。従来の Webhook 方式との切り替えも可能です。
-->

## 変更ファイルとその概要

✅ 付きのファイルを中心にレビューお願いします

<!-- ツリー状のアスキーアートで更新されたファイルを示し、それぞれ1-3行で簡潔に概要を記載 -->
<!-- 例:
vul_automation_test/
├── ✅ Config.gs
│   - SLACK_CHANNEL_ID, USE_THREAD_POSTING 設定を追加
│   - システムプロンプトを JSON 出力形式に変更
│   - validateConfig() にスレッド投稿モード用の検証を追加
│
├── ✅ Main.gs
│   - processEmail() でスレッド投稿モードの分岐処理を追加
│   - runTest(), debugProcessLatestEmail() にモード表示・確認機能を追加
│
├── ✅ SlackService.gs
│   - getSlackBotToken(): Bot Token 取得
│   - postMessageWithApi(): Web API でメッセージ投稿
│   - postMainAndThreads(): メイン + スレッド返信を投稿
│   - testSlackApiConnection(): Web API 接続テスト
│
├── ✅ VertexAI.gs
│   - parseAISummary(): AI の JSON 出力をパース
│   - formatMainMessage(): メインメッセージ用フォーマット
│   - formatThreadMessages(): スレッド返信用メッセージ配列生成
│   - formatVulnerabilityDetail(): 個別脆弱性の詳細フォーマット
│
└── .github/
    └── pull-request-template.md （新規追加）
-->

## テスト内容（参考までに）

<!-- 追加されたテストコードの概要を記載 -->
<!-- テストは ci で実行されるので、ここにはこのPRで追加されたテスト項目が何を検査するものなのかを記すだけで良いです-->
<!-- 例：
Google Apps Script のため自動テストはありませんが、以下の手動テストで動作確認しています。

- `runTest()`: 投稿モードに応じた設定検証・接続テストを実行
- `debugProcessLatestEmail()`: AI 出力のパース・フォーマット結果を確認
-->

## 関連 issue

<!-- ここにcloseするissueを記載 -->
<!-- ここは AI ではなく人間が手動で記載してください -->

close #

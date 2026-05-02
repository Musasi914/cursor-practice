# Issue 作成（GitHub CLI）

GitHub に **Issue を起票**する。エージェントは **`gh` を実行**して作成する（対話でテンプレート・タイトル・本文・ラベルを確定させる）。

運用上、`gh` で決まったコマンド列に寄せると **無駄な Issue が増えるリスクを抑えやすい**という整理がある（参考: [Cursor で GitHub の issue と project 管理（Qiita）](https://qiita.com/hiroshi_kubota_rh/items/6f9ebb879b4fede9efba)）。本文が長いときは **`--body-file` でファイル経由**にすると、エディタが勝手に開く問題を避けられる（参考: [Cursor と GitHub Issue の相性の良さを実感した開発効率化の取り組み（弥生開発者ブログ）](https://tech-blog.yayoi-kk.co.jp/entry/2026/01/23/110000)）。

## 前提

- **`gh auth login` 済み**で、対象リポジトリに Issue を作成できること。
- 既定の対象リポジトリは **`git remote get-url origin`** から `owner/repo` を推定する（例: `Musasi914/cursor-practice`）。別リポジトリならユーザーに明示してもらう。
- 必要なら `mkdir -p tmp` してから一時ファイルを使う（既存の `make-pr.md` と同様）。

## 作成前の確認

1. ユーザーが **Issue に書いてほしい内容**（概要・再現手順・期待値など）をプロンプトまたは会話で渡していること。不足なら **質問してから** 起票する。
2. **重複 Issue がないか**軽く確認するなら、`gh issue list --repo <owner>/<repo> --search "<キーワード>" --limit 10` 等を使ってよい（必須ではない）。

## 手順

### 1. リポジトリを決める

```bash
gh repo view --json nameWithOwner -q .nameWithOwner
```

別 repo に作る場合は `--repo owner/repo` を以降の `gh issue` に付ける。

### 2. テンプレートの有無を確認する

`.github/ISSUE_TEMPLATE/` 配下に `*.md` がある場合:

1. ファイル一覧を確認し、ユーザーに **どのテンプレートで起票するか**（または汎用でよいか）を確認する。
2. 選んだファイルを読み、**YAML フロントマター（先頭の `---`〜`---`）は GitHub CLI の本文としては使われない**ため取り除き、**本文だけ**を `tmp/issue_body.md` に書き出す（弥生ブログの取り組みと同様）。
3. フロントマターに `labels:` やタイトル案があれば参考にするが、**最終タイトル・ラベルはユーザー確認が望ましい**。

テンプレートが **無い**場合は、ユーザーとのやりとりから **Markdown 本文**を組み立て、`tmp/issue_body.md` に保存する。

（本リポジトリでは `.github/ISSUE_TEMPLATE/` に `bug_report.md`・`feature_request.md`・`general.md` がある。）

### 3. タイトル・ラベルを確定する

- **タイトル**: 一文で目的が分かるようにする（プレフィックス例: `[Bug]` `[Feature]` はチーム運用に合わせる）。
- **ラベル**: 付ける場合は実在する名前のみ使う。

  ```bash
  gh label list --repo <owner>/<repo> --limit 100
  ```

  チームでよく使うラベル名が決まっているなら、**このファイルや `.cursor/rules` に一覧を書いておく**と、`gh label list` の実行回数を減らせる（Qiita記事のコツ）。

ラベル不要なら `--label` は付けない。

### 4. Issue を作成する

長い本文は必ずファイル経由にする。

```bash
gh issue create \
  --repo <owner>/<repo> \
  --title "<タイトル>" \
  --body-file tmp/issue_body.md \
  --label "<labelA>" \
  --label "<labelB>"
```

単発ラベルや `--assignee @me` が必要なら、ユーザー指示に従って追加する。

作成後、表示される **Issue URL / 番号**をユーザーに伝える。

### 5. GitHub Projects に紐づける（任意）

組織・ユーザーで **GitHub Projects（Project v2）** を使っている場合のみ。プロジェクト番号・オーナー・フィールド ID はリポジトリごとに異なるため、**プレースホルダまたはチームドキュメント**で固定値を持つとよい（Qiita記事の「field id / label をルールに書いておく」）。

一般的な流れの例:

1. 作成した Issue の URL を取得する（Web で開いた URL でよい）。
2. `gh project item-add` でプロジェクトにアイテムとして追加する（サブコマンド・引数は `gh project --help` の現在仕様に合わせる）。
3. Status・Iteration 等を編集する場合は `gh project item-edit` や GraphQL（`gh api graphql`）を使う。**フィールド ID・オプション ID** は `gh project field-list` 等で取得し、運用ルールにキャッシュすると安定する。

このリポジトリに共通スクリプトが無い場合は、**Projects 連携はスキップ**し、「手動でプロジェクトに追加して」とユーザーへ一言してよい。

### 6. 後片付け

```bash
rm -f tmp/issue_body.md
```

### 7. 確認（任意）

```bash
gh issue view <number> --repo <owner>/<repo>
```

## MCP との使い分け（参考）

GitHub MCP が使える環境でも、**起票フローを `gh` に統一**するとコマンド列が再利用しやすく、ローカルでの検証もしやすい。読み取り専用の調査は MCP、作成は `gh`、といった切り分けでもよい。

## 関連コマンド

- ブランチ作成: `@.cursor/commands/make-branch.md`
- PR 作成: `@.cursor/commands/make-pr.md`

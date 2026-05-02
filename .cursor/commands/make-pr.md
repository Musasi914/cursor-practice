# 実装完了時のプルリクエスト作成アクション

実装が完了しましたので、以降の手順に従い GitHub 上でプルリクエストを作成してください。ただし、同じブランチを対象とした open なプルリクエストがすでにある場合は、作成ではなくアップデートしてください。

参考にしている運用例:

- [Cursor × GitHub MCP による開発生産性向上の実践知（DMM Developers Blog）](https://developersblog.dmm.com/entry/2026/01/19/110000) … 差分取得から説明文の構成、作成前の確認までをコマンドで型化する考え方
- [Cursor と GitHub Issue の相性の良さを実感した開発効率化の取り組み（弥生開発者ブログ）](https://tech-blog.yayoi-kk.co.jp/entry/2026/01/23/110000) … `gh` と `--body-file`、ブランチ名から Issue 番号を推測して `Closes` を載せる例

GitHub MCP で PR を作成してもよいが、本コマンドでは **`gh` で統一**する（ログ・再現性・チーム既定オプションと揃えやすい）。

## 推奨: PR 作成前の検証

以降の「## 0」に進む**前**に、@.cursor/agents/verifier.md の観点で、完了と主張した内容が本当に動作しテスト上も整合しているかを確認することを推奨する。インジェクションや XSS、秘密情報の混入など、差分のセキュリティが気になる場合は @.cursor/agents/security-reviewer.md も併用してよい。検証で問題があれば、先に解消してから以下を実行する。

## 0. 既存プルリクエストの確認

同じブランチを対象とした open なプルリクエストがすでにあるかを確認してください。存在しない場合は新規作成、する場合はアップデートするということを覚えておいてください。

## 0.5 事前チェック（弥生ブログと同種）

以下を実行し、問題があれば**ユーザーに確認してから**進める。

1. **作業ツリー**: `git status`。コミットされていない変更がある場合は stash するか、この PR に含めるかをユーザーに聞く（勝手に `stash` / `checkout --` はしない）。
2. **リモートへの push**: 現在ブランチが `origin` に無い、または未 push のコミットがある場合は、`git push -u origin HEAD`（またはチーム既定のリモート／上流）で push してから PR 作成へ進む。
3. **ベースとの差分の把握（DMM ブログと同種）**: PR 説明のたたき台にするため、ワンライナーでもよいので差分を確認する。

   ```bash
   branch=$(git branch --show-current)
   git fetch origin main 2>/dev/null || true
   git diff origin/main..."$branch" --name-status
   git diff origin/main..."$branch" --stat
   ```

   必要なら `git log origin/main.."$branch" --oneline` でコミット一覧も見る。

## 1. プルリクエストの説明文作成

@Branch の PR description を書いてください。@.github/pull_request_template.md を使ってください。

説明文はテンプレートの見出しに沿えつつ、**レビュアーが迷わない粒度**になるよう、差分から次を埋める（DMM ブログでいう「背景・概要・実施内容」のイメージと整合させる）。

- **なぜこの変更か（背景）**: Issue や要件があれば紐づけ。テンプレートに「背景」見出しが無ければ「概要」の冒頭や関連 Issue で説明する。
- **何を達成するか（概要）**: ユーザー視点で一文〜数文。
- **何を変えたか（実施内容）**: 「変更ファイルとその概要」をファイル単位または機能単位で具体的に。
- **Issue とのリンク**: ブランチ名が `features/20-foo` のように **`/<数字>-`** を含む場合は、その数字を Issue 番号として扱い、本文に **`Closes #20`** または **`Fixes #20`** を含める（GitHub がマージ時に自動クローズする）。弥生ブログと同様、`gh pr create` に `--issue` は無いため**本文でのリンクが必要**。ブランチ規約が異なる場合はユーザー確認または Issue URL を明示してもらう。

出力先は **tmp/pr_description.md**。ファイルへの出力は既存の内容を上書きする形にしてください。必要に応じて `mkdir -p tmp`。

長い説明は **`gh pr create` の `--body` に直接渡さず**、必ず `--body-file tmp/pr_description.md` を使う（長文 `--body` でエディタが開く事例を避ける。弥生ブログ）。

### PR タイトル（別途 `gh pr create --title` 用）

ブランチ接頭辞からコミット種別のプレフィックスを決め、**日本語で具体的な一文**にする（弥生ブログの「ブランチからタイトル」のイメージ）。

| ブランチ接頭辞 | タイトル先頭の例 |
|----------------|------------------|
| `features/` | `feat: ` |
| `fix/` | `fix: ` |
| `refactor/` | `refactor: ` |
| `docs/` | `docs: ` |
| `chore/` | `chore: ` |

Issue 番号が分かるときは `[#20]` のようにタイトルに含めてもよい。

### 作成前のユーザー確認（DMM ブログ）

**初めてこのブランチで PR を作成するとき**は、ドラフト作成の直前に、生成した **タイトル案と説明文の要点**をユーザーに提示し、チャットで **OK / Yes / はい** など明示的な承認がある場合のみ `gh pr create` に進む。ユーザーが既に「この内容で PR 作成」と指示している場合はその指示を承認とみなしてよい。

## 2. プルリクエスト作成

gh コマンドを用いて、上記の説明文とともにこのブランチを main ブランチにマージするためのプルリクエストを作成してください。ただし、同じブランチを対象とした open なプルリクエストがすでにある場合は、作成ではなくアップデートしてください。新規作成時は `gh pr create --draft` を使用してドラフトで作成し、既存 PR がある場合はドラフトのまま `gh pr edit` でアップデートしてください。

新規作成時は **`--title`** と **`--body-file tmp/pr_description.md`** を必ず指定する。

gh コマンドでプルリクエストを作成/更新する際は、ベースブランチを明示し、説明文・Assignee・Reviewer を指定してください（例）:

```bash
# 新規作成
gh pr create --draft --base main --title "feat: （日本語タイトル）" --body-file tmp/pr_description.md --assignee @me --reviewer itpf-3g-dena/itpf-3g

# 既存 PR の更新
gh pr edit <PR 番号> --body-file tmp/pr_description.md --add-assignee @me --add-reviewer itpf-3g-dena/itpf-3g
```

Assignee は gh コマンドで認証されているユーザー（`@me`）にしてください。

Reviewer は **itpf-3g-dena/itpf-3g** を指定してください。

備考: `gh pr edit` は `--add-assignee` / `--add-reviewer` を使用する仕様です。

### 作成結果の確認（弥生ブログ）

`gh` の応答が遅い環境があるため、必要なら数秒待ってから次で確認する。

```bash
gh pr list --head "$(git branch --show-current)"
```

## 3. 後片付け

tmp/pr_description.md を削除してください（例: `rm -f tmp/pr_description.md`）。

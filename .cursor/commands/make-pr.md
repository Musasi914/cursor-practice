# 実装完了時のプルリクエスト作成アクション

実装が完了しましたので、以降の手順に従い GitHub 上でプルリクエストを作成してください。 ただし、同じブランチを対象とした open なプルリクエストがすでにある場合は、作成ではなくアップデートしてください。

## 推奨: PR 作成前の検証

以降の「## 0」に進む**前**に、@.cursor/agents/verifier.md の観点で、完了と主張した内容が本当に動作しテスト上も整合しているかを確認することを推奨する。インジェクションや XSS、秘密情報の混入など、差分のセキュリティが気になる場合は @.cursor/agents/security-reviewer.md も併用してよい。検証で問題があれば、先に解消してから以下を実行する。

## 0. 既存プルリクエストの確認

同じブランチを対象とした open なプルリクエストがすでにあるかを確認してください。存在しない場合は新規作成、する場合はアップデートするということを覚えておいてください。

## 1. プルリクエストの説明文作成

@Branch の PR description を書いてください。 @.github/pull_request_template.md を使って書いてください。
出力先は tmp/pr_description.md にしてください。ファイルへの出力は、既存の内容を上書きする形にしてください。必要に応じて `tmp` ディレクトリを事前に作成してください（例: `mkdir -p tmp`）。

## 2. プルリクエスト作成

gh コマンドを用いて、上記の説明文とともにこのブランチを main ブランチにマージするためのプルリクエストを作成してください。ただし、同じブランチを対象とした open なプルリクエストがすでにある場合は、作成ではなくアップデートしてください。新規作成時は `gh pr create --draft` を使用してドラフトで作成し、既存 PR がある場合はドラフトのまま `gh pr edit` でアップデートしてください。

gh コマンドでプルリクエストを作成/更新する際は、ベースブランチを明示し、説明文・Assignee・Reviewer を指定してください（例）:

# 新規作成

gh pr create --draft --base main --body-file tmp/pr_description.md --assignee @me --reviewer itpf-3g-dena/itpf-3g

# 既存 PR の更新

gh pr edit <PR 番号> --body-file tmp/pr_description.md --add-assignee @me --add-reviewer itpf-3g-dena/itpf-3g

Assignee は gh コマンドで認証されているユーザー(@me)にしてください。

Reviewer は itpf-3g-dena/itpf-3g を指定してください。

備考: gh pr edit は --add-assignee / --add-reviewer を使用する仕様です。

## 3. 後片付け

tmp/pr_description.md を削除してください（例: `rm -f tmp/pr_description.md`）。

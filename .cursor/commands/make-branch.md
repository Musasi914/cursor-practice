# ブランチ作成（git）

`git` で作業ブランチを切る。エージェントはこのドキュメントに沿ってコマンドを実行する。

## 前提（読み替え）

- 既定はリモート **`origin`**・既定ブランチ **`main`**。リポジトリが異なる場合（例: `master` のみ）はユーザー指示または `git remote -v` / `git symbolic-ref refs/remotes/origin/HEAD` で確認して読み替える。

## 作成前の確認

1. 未コミットの変更で誤って持ち越さないよう、状態を確認する。

   ```bash
   git status
   ```

2. コミットしたくない変更がある場合は、`stash` や別ブランチでの処理など**ユーザーに確認してから**進める（勝手に破棄しない）。

## 手順

### 1. `main` をリモートに追いつかせる

まず次を試す（チェックアウトせずにローカル `main` を更新できる）。

```bash
git fetch origin main:main
```

**エラーになる場合**（ローカル `main` が `origin/main` と分岐している、`non-fast-forward` など）は、次で ff のみマージを試す。

```bash
git fetch origin
git switch main
git pull --ff-only origin main
```

`git pull --ff-only` が失敗したら **ここで中止**し、ユーザーに「ローカル `main` の余分なコミットをどうするか」を確認する（rebase / reset はユーザー判断）。

### 2. Issue の取得（チケット番号があるとき）

ブランチ名の素材としてタイトルを確認する。次のいずれかでよい。

- **推奨（CLI）**: `gh issue view <番号> --json title,number`
- **代替**: GitHub の Issue ページを開く、または GitHub MCP で Issue を取得

番号は `#12` 表記でもよいが、ブランチ名では **`12` のような数字のみ**を使う。

### 3. ブランチ名を決める

Git のブランチ名は **ASCII（英数字とハイフン）推奨**。日本語や記号は使わない。

#### プレフィックス

作業の種類に応じて次から選ぶ。

| 種類 | プレフィックス |
|------|----------------|
| 機能・改善 | `features/` |
| バグ修正 | `fix/` |
| リファクタ（挙動を変えない整理） | `refactor/` |
| ドキュメントのみ | `docs/` |
| ツール設定・依存更新・雑務など | `chore/` |

（チームで別プレフィックスを必須としている場合はユーザー指示に従う。）

#### チケット番号がある場合

```
{{プレフィックス}}{{番号}}-{{slug}}
```

例:

- `features/222-add-sort-ui`
- `fix/45-handle-storage-error`
- `refactor/10-extract-filter-hook`
- `docs/8-update-spec-links`
- `chore/3-bump-eslint`

- **slug**: Issue タイトルから **短い英語の kebab-case**（例: `Add sort to book list` → `add-sort-to-book-list`）。タイトルが日本語のみのときは内容を一言英語で要約する。
- **長さ**: 目安 **全体で 60 文字以内**。長い単語は省略してよい。
- 小文字統一。連続ハイフンや末尾ハイフンは避ける。

例:

- Issue `#222` タイトル「計画ドキュメントを追加」→ `features/222-add-plan-docs`

#### チケット番号がない場合

```
{{プレフィックス}}{{slug}}
```

作業内容を英語の kebab-case で表す（例: `features/update-readme-context-links`、`docs/fix-make-branch-typo`、`chore/update-node-ci`）。

### 4. ブランチを作成して移動する

ローカル ref **`main`** を起点にする（手順 1 で更新済みであることが前提）。

```bash
git switch -c {{branch_name}} main
```

`main` をチェックアウトしていなくても、`main` が指すコミットからブランチが作られる。

## よくある落とし穴

- **`git fetch origin main:main` が静かに失敗している**認識で進むと、古い `main` から枝が切れる。エラー時は必ずフォールバックまたはユーザー確認へ進む。
- **`git switch -c foo main`** は未コミット変更をそのまま新ブランチへ運ぶ。意図しないなら手順冒頭の `git status` で止める。
- **ブランチ名に `#` を入れない**（`features/#12-foo` は避ける）。

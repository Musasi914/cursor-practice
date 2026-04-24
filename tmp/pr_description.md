## 概要

[context/main/task.md](context/main/task.md) に沿い、Vite + React 19 + TypeScript で**読書記録アプリ**（紙本・電子籍の CRUD、状態フィルタ、タイトル検索、**`reading-journal:books` の `localStorage` 永続化、150ms デバウンス**）を実装しました。ルーターなしの一覧／詳細切替、削除は **`window.confirm` 必須**、一覧の既定表示は **`updatedAt` 降順**です。旧メモアプリのコンポーネント・フック・型を削除し、**README** に学習用文脈とストレージキー名を追記しています（フェーズ 0）。

## 変更ファイルとその概要

```
.
├── README.md
│   - 学習用リポの位置づけ、読書 UI への置き換え方針
│   - 永続化キー `reading-journal:books`（旧 `memo-app:items` 非使用）
│
├── src/App.tsx
│   - 読書アプリ専用エントリ（狭幅/広幅レイアウト、選択中 bookId）
│
├── src/index.css
│   - 読書 UI 用スタイル（フィルタ・一覧・フォーム・バナー等）
│
└── src/reading/
    ├── types/book.ts
    ├── lib/booksStorage.ts, filterBooks.ts, summarizeNotes.ts
    ├── statusLabels.ts
    ├── hooks/useBooks.ts
    └── components/ BookFilterBar, BookListRow, BookForm, ReadingListPanel
```

**削除**（置き換え）: `MemoList.tsx` / `MemoEditor.tsx` / `useMemos.ts` / `types/memo.ts`

## テスト内容（参考までに）

- `npm run build` / `npm run lint` を通過
- 手動確認（v1: Vitest 必須にしない合意のまま）

## 関連 issue

close #

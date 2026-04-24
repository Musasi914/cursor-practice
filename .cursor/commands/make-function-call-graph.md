# 関数呼び出しの依存関係を Graphviz (DOT 言語) 形式で出力する

選択したコードの関数呼び出しの依存関係を解析し、Graphviz (DOT 言語) 形式で出力してください。
コードレビューの効率化のため、単なる構文解析ではなく「ビジネスロジックの流れ」が分かるように以下のルールで作成してください。

## 作成ルール

1. **基本設定**:

   - `digraph G { ... }` ブロックを使用してください。
   - グラフ全体の設定として `rankdir=TB;` (上から下) または `rankdir=LR;` (左から右) を適切に選んでください。
   - ノードのデフォルト設定を `node [shape=box, style="rounded,filled", fillcolor=lightgrey, fontname="Helvetica"];` とし、読みやすくしてください。

2. **ノードの記述 (関数名 + 役割)**:

   - 各ノードの `label` 属性に、「関数名」と「ビジネス上の役割（日本語）」を改行(`\n`)区切りで記述してください。
   - 書式: `NodeID [label="関数名\n(役割の要約)"];`
   - 例: `calc_tax [label="calcTax\n(消費税額の算出)"];`

3. **エッジの記述 (データの流れ)**:

   - 呼び出しの際に渡されている主要なデータや目的を `label` 属性で添えてください。
   - 書式: `NodeA -> NodeB [label="渡すデータ"];`
   - 例: `order_process -> calc_tax [label="注文小計", fontsize=10];`

4. **フィルタリング**:
   - ロギング、単純な Getter/Setter、標準ライブラリの細かな呼び出しは省略し、メインのロジックに関わる部分のみを抽出してください。
   - 関連性の高い関数群は `subgraph cluster_X { ... }` でグループ化してラベルを付けてください。グループ化したノードの fillcolor はデフォルトとは違う、同一のカラーを使用してください。

## 出力例

```dot
digraph CodeFlow {
    rankdir=LR;
    node [shape=box, style="rounded,filled", fillcolor="#f0f0f0"];

    main [label="main\n(アプリ起動・初期化)"];
    auth [label="authenticateUser\n(認証トークン検証)"];

    main -> auth [label="Request Header"];
}
---

## ファイル保存

* **ファイル保存:**
    * 出力されたコードを `.dot` という拡張子で保存してください。
    * 保存先は docs/figures にしてください。
    * ファイル名は適切なものをつけてください。
* **画像出力:**
    * dot ファイルだけでなく、png 画像も保存してください。
    * コマンドは dot -Tpng input.dot -o output.png です。

---
```

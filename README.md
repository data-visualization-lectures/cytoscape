# Cytoscape Network Visualization

インタラクティブなネットワーク可視化ツールです。GEXF/GraphML/CSV のインポート、計算指標によるスタイリング、凡例付きのネットワーク表現をブラウザで作成できます。

## 主な機能

- **複数フォーマット対応**: GEXF、GraphML、CSV/TSV（エッジリスト）をインポート可能
- **CSV列マッピング**: 始点・終点・重みの列を指定。日本語ヘッダや Excel からの貼り付けに対応。重複エッジは重みを合計して集約できる
- **有向 / 無向**: 無向グラフでは矢印を消し、共起ネットワークとして読める
- **計算指標**: 次数・重み付き次数・コミュニティ（Louvain）を自動計算し、サイズや色に割り当て
- **視覚符号化**: カテゴリ/連続の尺度切替、複数パレット（色覚安全を含む）、サイズ範囲、ラベル表示（すべて / 上位N / 選択時 / なし）
- **読める図**: 凡例、ホバー属性、近傍ハイライト、タイトル・出典
- **サンプルデータセット**: 社会的ネットワーク、科学的ネットワーク、共起CSV
- **レイアウト**: Circle, Grid, Concentric, Breadthfirst, Cose, Random
- **エクスポート**: PNG（タイトル・凡例・出典込み）と SVG

## 使い方

### ファイルのインポート

1. 「データファイルの読込」をクリック
2. GEXF（.gexf）、GraphML（.graphml）、または CSV/TSV を選択
3. CSV の場合は始点・終点・重みの列を確認してグラフを作成します

### CSV / Excel からの作成

1. 「CSVを貼り付け」を開くか、CSVファイルを読み込む
2. 始点・終点列を指定（`source`/`from`/`始点` と `target`/`to`/`終点` は自動推定）
3. 必要なら重み列と「重複エッジを集約」を選ぶ
4. 読み込み後、ノードサイズは次数、色はコミュニティ、エッジ太さは重みが初期値になります

### サンプルデータセットの使用

ドロップダウンメニューから以下のデータセットを選択できます（社会的ネットワーク→科学的ネットワークの順）：

#### 社会的ネットワーク

- **Les Misérables** (63KB)
  - ヴィクトル・ユゴーの小説「レ・ミゼラブル」のキャラクター共演ネットワーク
  - 77ノード、254エッジ
  - 出典: [Gephi](https://gephi.org/datasets/)
  - 形式: GEXF

- **Game of Thrones** (36KB)
  - ゲーム・オブ・スローンズのキャラクター関係ネットワーク
  - 107ノード、353エッジ
  - 出典: [Melanie Walsh's GitHub](https://github.com/melaniewalsh/sample-social-network-datasets)
  - 形式: GraphML

- **Marvel Universe** (1.1MB)
  - マーベル・ユニバースのキャラクター共演ネットワーク
  - 6,439ノード、171,417エッジ
  - 出典: [Melanie Walsh's GitHub](https://github.com/melaniewalsh/sample-social-network-datasets)
  - 形式: GraphML

- **Quakers (17th Century)** (35KB)
  - 17世紀のクエーカー教徒の社会的ネットワーク
  - 174ノード、817エッジ
  - 出典: [Melanie Walsh's GitHub](https://github.com/melaniewalsh/sample-social-network-datasets)
  - 形式: GraphML

#### 科学的ネットワーク

- **EuroSiS** (1.6MB)
  - ヨーロッパのウェブグラフ
  - 1,285ノード、6,594エッジ
  - 出典: [GEXF公式サイト](https://gexf.net/data/)
  - 形式: GEXF

- **Diseasome** (545KB)
  - 疾患と遺伝子の関連ネットワーク
  - 1,419ノード、2,738エッジ
  - 出典: [GEXF公式サイト](https://gexf.net/data/)
  - 形式: GEXF

- **C. Elegans** (152KB)
  - 線虫の神経ネットワーク
  - 297ノード、2,148エッジ
  - 出典: [GEXF公式サイト](https://gexf.net/data/)
  - 形式: GEXF

- **Java Dependencies** (701KB)
  - Javaパッケージの依存関係グラフ
  - 1,538ノード、8,032エッジ
  - 出典: [Gephi](https://gephi.org/datasets/)
  - 形式: GEXF

- **Power Grid** (982KB)
  - アメリカの電力網トポロジー
  - 4,941ノード、6,594エッジ
  - 出典: [Gephi](https://gephi.org/datasets/)
  - 形式: GEXF

### ノード / エッジのスタイリング

読み込み時に次数・コミュニティが計算されます。属性がなくても「サイズ = 次数」「色 = コミュニティ」から始められます。

1. **色**: 属性を選び、尺度（自動 / カテゴリ / 連続）とパレットを指定
2. **サイズ / 太さ**: 数値属性でスケーリング。範囲は最小・最大で調整
3. **ラベル**: すべて / 上位N件 / 選択時のみ / なし
4. **向きと矢印**: 無向では矢印オフ。有向では矢印オン
5. **凡例**: 色とサイズの意味を右下に表示。ホバーで属性を確認

### レイアウトの変更

1. 「レイアウト」ドロップダウンからアルゴリズムを選択
2. 「フィット」で全体を画面に収める
3. ノードをクリックすると近傍をハイライトします。背景クリックで解除

### エクスポート

「エクスポート」から PNG または SVG を選べます。PNG にはタイトル、凡例、出典が含まれます。

## 技術スタック

- **Cytoscape.js**: グラフ可視化ライブラリ
- **Graphology**: グラフデータ構造と Louvain コミュニティ検出
- **Graphology-library**: GEXF/GraphMLパーサー
- **Cytoscape-SVG**: SVGエクスポート機能

## ファイル構成

```
cytoscape/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── script.js           # アプリケーションロジック
├── network-utils.js    # CSV解析・列推定・エッジ集約
├── data/

│   └── samples/        # サンプルデータセット
│       ├── eurosis.gexf
│       ├── diseasome.gexf
│       ├── celegans.gexf
│       ├── java.gexf
│       ├── power-grid.gexf
│       ├── les-miserables.gexf
│       ├── game-of-thrones.graphml
│       ├── marvel.graphml
│       └── quakers.graphml
├── test.gexf           # テスト用GEXFファイル
└── test.graphml        # テスト用GraphMLファイル
```

## 開発

### ローカルサーバーの起動

```bash
# Pythonの場合
python -m http.server 8001

# Node.jsの場合
npx http-server -p 8001
```

ブラウザで `http://localhost:8001` を開いてください。

http://localhost:8001/?auth_debug

### 新しいデータセットの追加

1. GEXF/GraphMLファイルを `data/samples/` に配置
2. `script.js` の `sampleDatasets` オブジェクトに追加
3. `index.html` のドロップダウンにオプションを追加

## データセットのライセンスと出典

- **EuroSiS, Diseasome, C. Elegans**: [GEXF公式サイト](https://gexf.net/data/)
- **Java Dependencies, Power Grid, Les Misérables**: [Gephi Datasets](https://gephi.org/datasets/)
- **Game of Thrones, Marvel Universe, Quakers**: [Melanie Walsh's GitHub](https://github.com/melaniewalsh/sample-social-network-datasets) (教育目的で作成)

## ブラウザ対応

- Chrome (推奨)
- Firefox
- Safari
- Edge

## 既知の制限事項

- 非常に大きなグラフ（3,000ノードまたは20,000エッジ超）ではコミュニティ検出を省略します。10,000ノード以上は描画が重くなることがあります
- SIF形式は現在サポートされていません（GEXF/GraphML/CSVに変換してください）

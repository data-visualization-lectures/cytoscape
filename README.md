# Cytoscape Network Visualization

インタラクティブなネットワーク可視化ツールです。GEXF/GraphMLファイルのインポート、動的なノードスタイリング、複数のレイアウトアルゴリズムをサポートしています。

## 主な機能

- **複数フォーマット対応**: GEXF、GraphML形式のファイルをインポート可能
- **サンプルデータセット**: 9つのプリロードされたネットワークデータセット（科学的ネットワーク5つ、社会的ネットワーク4つ）
- **動的ノードスタイリング**: ノード属性に基づいて色とサイズを変更
- **レイアウトアルゴリズム**: Circle, Grid, Concentric, Breadthfirst, Cose
- **アニメーションイージング**: レイアウト変更時のスムーズなアニメーション
- **SVGエクスポート**: 可視化結果をSVGファイルとしてダウンロード

## 使い方

### ファイルのインポート

1. 「ファイルを選択」ボタンをクリック
2. GEXF（.gexf）またはGraphML（.graphml）ファイルを選択
3. グラフが自動的に読み込まれ、可視化されます

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

### ノードのスタイリング

インポートしたグラフにノード属性が含まれている場合：

1. **色**: 「Color by」ドロップダウンから属性を選択
   - カテゴリカル属性: 各カテゴリに異なる色を自動割り当て
   - 数値属性: グラデーションで表現

2. **サイズ**: 「Size by」ドロップダウンから数値属性を選択
   - 値に基づいて20px〜60pxの範囲でスケーリング

### レイアウトの変更

1. 「Layout」ドロップダウンからレイアウトアルゴリズムを選択
2. 「Easing」ドロップダウンでアニメーションの種類を選択
3. レイアウトが自動的に適用されます

### SVGエクスポート

「Download SVG」ボタンをクリックすると、現在の可視化結果をSVGファイルとしてダウンロードできます。

## 技術スタック

- **Cytoscape.js**: グラフ可視化ライブラリ
- **Graphology**: グラフデータ構造とアルゴリズム
- **Graphology-library**: GEXF/GraphMLパーサー
- **Cytoscape-SVG**: SVGエクスポート機能

## ファイル構成

```
cytoscape/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── script.js           # アプリケーションロジック
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

- 非常に大きなグラフ（10,000ノード以上）はパフォーマンスに影響する可能性があります
- SIF形式は現在サポートされていません（GEXF/GraphMLに変換してください）

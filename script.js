import {
    parseTable,
    guessMapping,
    buildGraphFromEdgeRows,
    inferScaleType,
    numericExtent,
    scaleLinear,
    CATEGORICAL_PALETTES,
    SEQUENTIAL_PALETTES,
    pickCategoryColor,
    sequentialColor
} from './network-utils.js';

i18next.init({
    lng: navigator.language.startsWith('ja') ? 'ja' : 'en',
    fallbackLng: 'en',
    resources: {
        ja: {
            translation: {
                pageTitle: 'Cytoscape Network Visualization',
                layoutLabel: 'レイアウト:',
                easingLabel: 'イージング:',
                colorLabel: '色:',
                sizeLabel: 'サイズ:',
                labelLabel: 'ラベル:',
                sampleLabel: 'サンプル・データセット:',
                parseError: 'グラフデータの解析に失敗しました',
                uploadError: 'サポートされていないファイル形式です。.gexf、.graphml、.csv ファイルをアップロードしてください。',
                csvParseError: 'CSVの解析に失敗しました。始点と終点の列を指定してください。',
                csvEmptyError: 'CSVファイルにデータ行がありません。',
                loadError: 'データセットの読み込みに失敗しました。インターネット接続を確認してください。',
                loginRequired: '{{action}}するにはログインしてください。',
                saveSuccess: 'プロジェクトを保存しました！',
                loadSuccess: 'プロジェクトを読み込みました！',
                deleteSuccess: 'プロジェクトを削除しました。',
                btnLoadFile: 'データファイルの読込',
                btnLoadProject: 'プロジェクトの読込',
                btnSaveProject: 'プロジェクトの保存',
                btnExport: 'エクスポート',
                datasetLoadError: 'データセットの読み込みに失敗しました。インターネット接続を確認してください。',
                nodeGroupLabel: 'ノード',
                edgeGroupLabel: 'エッジ',
                edgeColorLabel: '色:',
                edgeSizeLabel: '太さ:',
                edgeLabelLabel: 'ラベル:',
                graphGroupLabel: 'グラフ',
                directedLabel: '向き:',
                directedOption: '有向',
                undirectedOption: '無向',
                arrowLabel: '矢印',
                curveLabel: '線:',
                straightOption: '直線',
                bgLabel: '背景:',
                bgWhite: '白',
                bgLight: '淡色',
                bgDark: '暗色',
                scaleLabel: '尺度:',
                scaleAuto: '自動',
                scaleCategorical: 'カテゴリ',
                scaleSequential: '連続',
                paletteLabel: 'パレット:',
                paletteOkabe: '色覚安全',
                sizeMinLabel: '最小:',
                sizeMaxLabel: '最大:',
                labelModeLabel: '表示:',
                labelAll: 'すべて',
                labelTop: '上位',
                labelSelected: '選択時',
                labelNone: 'なし',
                labelTopN: 'N:',
                annotateGroupLabel: '注釈',
                titleLabel: 'タイトル:',
                sourceLabel: '出典:',
                titlePlaceholder: '図のタイトル',
                sourcePlaceholder: '出典・注記',
                pasteCsvBtn: 'CSVを貼り付け',
                fitBtn: 'フィット',
                summaryEmpty: 'グラフ未読込',
                summaryFilled: '{{nodes}}ノード · {{edges}}エッジ · {{direction}}',
                noneOption: '(なし)',
                defaultOption: '(既定)',
                csvModalTitle: 'CSVの列対応',
                csvModalHelp: '始点と終点の列を指定してください。Excelから表を貼り付けることもできます。',
                csvPastePlaceholder: 'source,target,weight または Excelから貼り付け',
                mapSource: '始点',
                mapTarget: '終点',
                mapWeight: '重み',
                mapAggregate: '重複エッジを集約（重みを合計）',
                mapDirected: '有向グラフ',
                csvApply: 'グラフを作成',
                cancel: 'キャンセル',
                exportTitle: 'エクスポート',
                exportHelp: 'PNGはタイトル・凡例・出典を含みます。SVGはグラフ本体です。',
                largeGraphWarning: 'ノードまたはエッジが多いため、描画が遅くなることがあります。',
                aggregatedNote: '重複エッジを{{count}}件集約しました。',
                processingExport: '書き出し中です',
                processingFile: 'ファイルを読み込み中です',
                processingGeneric: '処理中です',
                processingProjectList: 'プロジェクト一覧を読み込み中です',
                processingProjectLoad: 'プロジェクトを読み込み中です',
                processingProjectSave: 'プロジェクトを保存中です',
                processingSample: 'サンプルデータを読み込み中です',
                processingSavePrep: '保存準備中です',
                legendNodeColor: 'ノード色',
                legendNodeSize: 'ノードサイズ',
                legendEdgeColor: 'エッジ色',
                legendMore: '他{{count}}件'
            }
        },
        en: {
            translation: {
                pageTitle: 'Cytoscape Network Visualization',
                layoutLabel: 'Layout:',
                easingLabel: 'Easing:',
                colorLabel: 'Color:',
                sizeLabel: 'Size:',
                labelLabel: 'Label:',
                sampleLabel: 'Sample Dataset:',
                parseError: 'Failed to parse graph data',
                uploadError: 'Unsupported file format. Please upload .gexf, .graphml, or .csv files.',
                csvParseError: 'Failed to parse CSV. Please choose source and target columns.',
                csvEmptyError: 'The CSV file contains no data rows.',
                loadError: 'Failed to load dataset. Please check your internet connection.',
                loginRequired: 'Please log in to {{action}}.',
                saveSuccess: 'Project saved successfully!',
                loadSuccess: 'Project loaded!',
                deleteSuccess: 'Project deleted.',
                btnLoadFile: 'Load Data File',
                btnLoadProject: 'Load Project',
                btnSaveProject: 'Save Project',
                btnExport: 'Export',
                datasetLoadError: 'Failed to load dataset. Please check your internet connection.',
                nodeGroupLabel: 'Node',
                edgeGroupLabel: 'Edge',
                edgeColorLabel: 'Color:',
                edgeSizeLabel: 'Width:',
                edgeLabelLabel: 'Label:',
                graphGroupLabel: 'Graph',
                directedLabel: 'Direction:',
                directedOption: 'Directed',
                undirectedOption: 'Undirected',
                arrowLabel: 'Arrows',
                curveLabel: 'Edges:',
                straightOption: 'Straight',
                bgLabel: 'Background:',
                bgWhite: 'White',
                bgLight: 'Light',
                bgDark: 'Dark',
                scaleLabel: 'Scale:',
                scaleAuto: 'Auto',
                scaleCategorical: 'Categorical',
                scaleSequential: 'Sequential',
                paletteLabel: 'Palette:',
                paletteOkabe: 'Colorblind-safe',
                sizeMinLabel: 'Min:',
                sizeMaxLabel: 'Max:',
                labelModeLabel: 'Show:',
                labelAll: 'All',
                labelTop: 'Top N',
                labelSelected: 'Selected',
                labelNone: 'None',
                labelTopN: 'N:',
                annotateGroupLabel: 'Annotate',
                titleLabel: 'Title:',
                sourceLabel: 'Source:',
                titlePlaceholder: 'Chart title',
                sourcePlaceholder: 'Source / notes',
                pasteCsvBtn: 'Paste CSV',
                fitBtn: 'Fit',
                summaryEmpty: 'No graph loaded',
                summaryFilled: '{{nodes}} nodes · {{edges}} edges · {{direction}}',
                noneOption: '(None)',
                defaultOption: '(Default)',
                csvModalTitle: 'Map CSV columns',
                csvModalHelp: 'Choose source and target columns. You can also paste a table from Excel.',
                csvPastePlaceholder: 'source,target,weight or paste from Excel',
                mapSource: 'Source',
                mapTarget: 'Target',
                mapWeight: 'Weight',
                mapAggregate: 'Aggregate duplicate edges (sum weight)',
                mapDirected: 'Directed graph',
                csvApply: 'Create graph',
                cancel: 'Cancel',
                exportTitle: 'Export',
                exportHelp: 'PNG includes title, legend, and source. SVG is the graph only.',
                largeGraphWarning: 'This graph is large and may render slowly.',
                aggregatedNote: 'Aggregated {{count}} duplicate edges.',
                processingExport: 'Exporting…',
                processingFile: 'Loading file…',
                processingGeneric: 'Working…',
                processingProjectList: 'Loading project list…',
                processingProjectLoad: 'Loading project…',
                processingProjectSave: 'Saving project…',
                processingSample: 'Loading sample…',
                processingSavePrep: 'Preparing save…',
                legendNodeColor: 'Node color',
                legendNodeSize: 'Node size',
                legendEdgeColor: 'Edge color',
                legendMore: '+{{count}} more'
            }
        }
    }
}, function () {
    applyI18n();
});

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = i18next.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.setAttribute('placeholder', i18next.t(el.getAttribute('data-i18n-placeholder')));
    });
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = i18next.t('pageTitle');
}

document.addEventListener('DOMContentLoaded', function () {
    applyI18n();

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            { data: { id: 'a', label: 'Node A', category: 'A', score: 10 } },
            { data: { id: 'b', label: 'Node B', category: 'A', score: 20 } },
            { data: { id: 'c', label: 'Node C', category: 'B', score: 30 } },
            { data: { id: 'd', label: 'Node D', category: 'B', score: 40 } },
            { data: { id: 'e', label: 'Node E', category: 'C', score: 50 } },
            { data: { id: 'f', label: 'Node F', category: 'C', score: 60 } },
            { data: { id: 'g', label: 'Node G', category: 'C', score: 70 } },
            { data: { source: 'a', target: 'b' } },
            { data: { source: 'a', target: 'c' } },
            { data: { source: 'a', target: 'd' } },
            { data: { source: 'b', target: 'e' } },
            { data: { source: 'b', target: 'f' } },
            { data: { source: 'c', target: 'g' } }
        ],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(label)',
                    'color': '#fff',
                    'font-size': '12px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'width': 30,
                    'height': 30,
                    'text-outline-width': 2,
                    'text-outline-color': '#666'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'none',
                    'curve-style': 'bezier'
                }
            },
            {
                selector: '.faded',
                style: { 'opacity': 0.12 }
            }
        ],
        layout: { name: 'cose', animate: false }
    });

    const els = {
        layout: document.getElementById('layout-select'),
        easing: document.getElementById('easing-select'),
        nodeColor: document.getElementById('node-color-select'),
        nodeColorScale: document.getElementById('node-color-scale'),
        nodePalette: document.getElementById('node-palette-select'),
        nodeSize: document.getElementById('node-size-select'),
        nodeSizeMin: document.getElementById('node-size-min'),
        nodeSizeMax: document.getElementById('node-size-max'),
        nodeLabel: document.getElementById('node-label-select'),
        labelMode: document.getElementById('label-mode-select'),
        labelTopN: document.getElementById('label-top-n'),
        edgeColor: document.getElementById('edge-color-select'),
        edgeColorScale: document.getElementById('edge-color-scale'),
        edgePalette: document.getElementById('edge-palette-select'),
        edgeSize: document.getElementById('edge-size-select'),
        edgeLabel: document.getElementById('edge-label-select'),
        directed: document.getElementById('directed-select'),
        arrows: document.getElementById('arrow-toggle'),
        curve: document.getElementById('curve-select'),
        background: document.getElementById('background-select'),
        title: document.getElementById('chart-title-input'),
        source: document.getElementById('chart-source-input'),
        sample: document.getElementById('sample-dataset-select'),
        fileUpload: document.getElementById('file-upload'),
        summary: document.getElementById('graph-summary'),
        chartTitle: document.getElementById('chart-title'),
        chartSource: document.getElementById('chart-source'),
        legend: document.getElementById('legend'),
        tooltip: document.getElementById('tooltip'),
        csvModal: document.getElementById('csv-modal'),
        csvPaste: document.getElementById('csv-paste'),
        mapSource: document.getElementById('map-source'),
        mapTarget: document.getElementById('map-target'),
        mapWeight: document.getElementById('map-weight'),
        mapAggregate: document.getElementById('map-aggregate'),
        mapDirected: document.getElementById('map-directed'),
        csvPreview: document.getElementById('csv-preview'),
        exportModal: document.getElementById('export-modal')
    };

    let autoEncodeOnNextLoad = true;
    let currentProjectId = null;
    let currentProjectName = null;
    let pinnedNode = null;
    let lastLegendModel = null;

    const sampleDatasets = {
        eurosis: 'data/samples/eurosis.gexf',
        diseasome: 'data/samples/diseasome.gexf',
        celegans: 'data/samples/celegans.gexf',
        java: 'data/samples/java.gexf',
        lesmis: 'data/samples/les-miserables.gexf',
        powergrid: 'data/samples/power-grid.gexf',
        got: 'data/samples/game-of-thrones.graphml',
        marvel: 'data/samples/marvel.graphml',
        quakers: 'data/samples/quakers.graphml',
        cooccurrence: 'data/samples/cooccurrence.csv'
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function backgroundColor() {
        if (els.background.value === 'dark') return '#1b1f24';
        if (els.background.value === 'light') return '#f4f4f9';
        return '#ffffff';
    }

    function isDirected() {
        return els.directed.value === 'directed';
    }

    function arrowsEnabled() {
        return els.arrows.checked && els.curve.value !== 'haystack';
    }

    function getInterpolator(palette) {
        const key = SEQUENTIAL_PALETTES[palette];
        if (key && typeof d3 !== 'undefined' && typeof d3[key] === 'function') return d3[key];
        if (typeof d3 !== 'undefined' && typeof d3.interpolateBlues === 'function') return d3.interpolateBlues;
        return null;
    }

    function collectValues(collection, attr) {
        const values = [];
        collection.forEach((ele) => {
            const v = ele.data(attr);
            if (v !== undefined && v !== null && String(v) !== '') values.push(v);
        });
        return values;
    }

    function resolvedScale(selectEl, collection, attr) {
        if (!attr) return 'categorical';
        if (selectEl.value === 'categorical' || selectEl.value === 'sequential') return selectEl.value;
        return inferScaleType(collectValues(collection, attr));
    }

    function getSettings() {
        return {
            layout: els.layout.value,
            easing: els.easing.value,
            directed: els.directed.value,
            arrows: els.arrows.checked,
            curve: els.curve.value,
            background: els.background.value,
            nodeColor: els.nodeColor.value,
            nodeColorScale: els.nodeColorScale.value,
            nodePalette: els.nodePalette.value,
            nodeSize: els.nodeSize.value,
            nodeSizeMin: Number(els.nodeSizeMin.value) || 20,
            nodeSizeMax: Number(els.nodeSizeMax.value) || 80,
            nodeLabel: els.nodeLabel.value,
            labelMode: els.labelMode.value,
            labelTopN: Number(els.labelTopN.value) || 20,
            edgeColor: els.edgeColor.value,
            edgeColorScale: els.edgeColorScale.value,
            edgePalette: els.edgePalette.value,
            edgeSize: els.edgeSize.value,
            edgeLabel: els.edgeLabel.value,
            title: els.title.value,
            source: els.source.value
        };
    }

    function applySettings(settings) {
        if (!settings) return;
        const assign = (el, value) => {
            if (!el || value === undefined || value === null) return;
            el.value = value;
        };
        assign(els.layout, settings.layout);
        assign(els.easing, settings.easing);
        assign(els.directed, settings.directed);
        if (typeof settings.arrows === 'boolean') els.arrows.checked = settings.arrows;
        assign(els.curve, settings.curve);
        assign(els.background, settings.background);
        assign(els.nodeColor, settings.nodeColor);
        assign(els.nodeColorScale, settings.nodeColorScale);
        assign(els.nodePalette, settings.nodePalette);
        assign(els.nodeSize, settings.nodeSize);
        assign(els.nodeSizeMin, settings.nodeSizeMin);
        assign(els.nodeSizeMax, settings.nodeSizeMax);
        assign(els.nodeLabel, settings.nodeLabel);
        assign(els.labelMode, settings.labelMode);
        assign(els.labelTopN, settings.labelTopN);
        assign(els.edgeColor, settings.edgeColor);
        assign(els.edgeColorScale, settings.edgeColorScale);
        assign(els.edgePalette, settings.edgePalette);
        assign(els.edgeSize, settings.edgeSize);
        assign(els.edgeLabel, settings.edgeLabel);
        if (settings.title != null) els.title.value = settings.title;
        if (settings.source != null) els.source.value = settings.source;
    }

    function captureState() {
        return {
            version: 1,
            chartType: 'cytoscape',
            data: cy.json(),
            settings: getSettings()
        };
    }

    function populateSelect(select, values, firstLabel) {
        const current = select.value;
        while (select.options.length > 1) select.remove(1);
        select.options[0].text = firstLabel;
        values.forEach((attr) => select.add(new Option(attr, attr)));
        if (values.includes(current)) select.value = current;
        else if (current && current !== '') select.value = '';
    }

    function extractAndPopulateAttributes() {
        const nodeAttributes = new Set();
        cy.nodes().forEach((node) => {
            Object.keys(node.data()).forEach((key) => {
                if (key !== 'id' && key !== 'label' && key !== 'x' && key !== 'y') {
                    nodeAttributes.add(key);
                }
            });
        });
        const edgeAttributes = new Set();
        cy.edges().forEach((edge) => {
            Object.keys(edge.data()).forEach((key) => {
                if (key !== 'id' && key !== 'source' && key !== 'target') {
                    edgeAttributes.add(key);
                }
            });
        });
        populateSelect(els.nodeColor, [...nodeAttributes], i18next.t('noneOption'));
        populateSelect(els.nodeSize, [...nodeAttributes], i18next.t('noneOption'));
        populateSelect(els.nodeLabel, [...nodeAttributes], i18next.t('defaultOption'));
        populateSelect(els.edgeColor, [...edgeAttributes], i18next.t('noneOption'));
        populateSelect(els.edgeSize, [...edgeAttributes], i18next.t('noneOption'));
        populateSelect(els.edgeLabel, [...edgeAttributes], i18next.t('noneOption'));
    }

    function computeDegreeOnly() {
        cy.nodes().forEach((node) => {
            node.data('degree', node.degree());
            node.data('inDegree', node.indegree());
            node.data('outDegree', node.outdegree());
            let weighted = 0;
            node.connectedEdges().forEach((edge) => {
                weighted += Number(edge.data('weight')) || 1;
            });
            node.data('weightedDegree', weighted);
        });
    }

    function computeMetrics() {
        computeDegreeOnly();
        const nodeCount = cy.nodes().length;
        const edgeCount = cy.edges().length;
        if (nodeCount === 0) return;
        if (nodeCount > 3000 || edgeCount > 20000) return;

        try {
            const directed = isDirected();
            const graph = new graphology({
                type: directed ? 'directed' : 'undirected',
                multi: false,
                allowSelfLoops: false
            });
            cy.nodes().forEach((node) => graph.addNode(node.id()));
            cy.edges().forEach((edge) => {
                const source = edge.source().id();
                const target = edge.target().id();
                if (source === target) return;
                const weight = Number(edge.data('weight')) || 1;
                try {
                    graph.mergeEdge(source, target, { weight });
                } catch (error) {
                    // skip duplicate or invalid edges
                }
            });
            graphologyLibrary.communitiesLouvain.assign(graph, { nodeCommunityAttribute: 'community' });
            graph.forEachNode((node, attrs) => {
                const ele = cy.getElementById(node);
                if (ele && ele.nonempty()) ele.data('community', attrs.community);
            });
        } catch (error) {
            console.warn('Community detection skipped:', error);
        }
    }

    function maybeAutoEncode(fromCsv) {
        if (!autoEncodeOnNextLoad) return;
        autoEncodeOnNextLoad = false;
        const hasAttr = (attr) => cy.nodes().some((n) => n.data(attr) !== undefined);
        const hasEdgeAttr = (attr) => cy.edges().some((e) => e.data(attr) !== undefined);
        if (hasAttr('community')) {
            els.nodeColor.value = 'community';
            els.nodeColorScale.value = 'categorical';
            if (!['category10', 'tableau10', 'set2', 'okabe'].includes(els.nodePalette.value)) {
                els.nodePalette.value = 'category10';
            }
        }
        if (hasAttr('degree')) {
            const weightedDiffers = cy.nodes().some((n) => n.data('weightedDegree') !== n.data('degree'));
            els.nodeSize.value = (fromCsv && weightedDiffers && hasAttr('weightedDegree'))
                ? 'weightedDegree'
                : 'degree';
        }
        if (hasEdgeAttr('weight')) {
            els.edgeSize.value = 'weight';
            if (fromCsv) {
                els.edgeColor.value = 'weight';
                els.edgeColorScale.value = 'sequential';
                if (!SEQUENTIAL_PALETTES[els.edgePalette.value]) els.edgePalette.value = 'blues';
            }
        }
        els.labelMode.value = cy.nodes().length > 80 ? 'top' : 'all';
        els.labelTopN.disabled = els.labelMode.value !== 'top';
    }

    function nodeLabelText(node) {
        const attr = els.nodeLabel.value;
        if (attr && node.data(attr) !== undefined) return String(node.data(attr));
        return String(node.data('label') || node.id());
    }

    function labelVisibleIds() {
        const mode = els.labelMode.value;
        if (mode === 'none') return new Set();
        if (mode === 'all') return new Set(cy.nodes().map((n) => n.id()));
        if (mode === 'selected') {
            const ids = new Set();
            if (pinnedNode) {
                pinnedNode.closedNeighborhood('node').forEach((n) => ids.add(n.id()));
            }
            cy.$('node:selected').forEach((n) => ids.add(n.id()));
            return ids;
        }
        const n = Math.max(1, Number(els.labelTopN.value) || 20);
        const sizeAttr = els.nodeSize.value || 'degree';
        return new Set(
            cy.nodes()
                .toArray()
                .sort((a, b) => (Number(b.data(sizeAttr)) || 0) - (Number(a.data(sizeAttr)) || 0))
                .slice(0, n)
                .map((node) => node.id())
        );
    }

    function colorFor(value, scale, paletteName, extent, categoryMap) {
        if (scale === 'sequential') {
            const interpolator = getInterpolator(paletteName);
            return sequentialColor(interpolator, Number(value), extent.min, extent.max);
        }
        const palette = CATEGORICAL_PALETTES[paletteName] || CATEGORICAL_PALETTES.category10;
        return pickCategoryColor(value, categoryMap, palette);
    }

    function updateNodeStyle() {
        const colorAttr = els.nodeColor.value;
        const sizeAttr = els.nodeSize.value;
        const sizeMin = Number(els.nodeSizeMin.value) || 20;
        const sizeMax = Number(els.nodeSizeMax.value) || 80;
        const visibleLabels = labelVisibleIds();
        const dark = els.background.value === 'dark';
        const categoryMap = new Map();
        const colorScale = resolvedScale(els.nodeColorScale, cy.nodes(), colorAttr);
        const colorExtent = numericExtent(collectValues(cy.nodes(), colorAttr));
        const sizeExtent = numericExtent(collectValues(cy.nodes(), sizeAttr));

        cy.nodes().forEach((node) => {
            const data = node.data();
            const style = {
                'background-color': '#666',
                'width': 30,
                'height': 30,
                'label': visibleLabels.has(node.id()) ? nodeLabelText(node) : '',
                'font-size': '12px',
                'color': dark ? '#f3f4f6' : '#fff',
                'text-outline-color': '#666',
                'text-outline-width': 2
            };

            if (colorAttr && data[colorAttr] !== undefined && data[colorAttr] !== '') {
                const color = colorFor(data[colorAttr], colorScale, els.nodePalette.value, colorExtent, categoryMap);
                style['background-color'] = color;
                style['text-outline-color'] = color;
            }

            if (sizeAttr && data[sizeAttr] !== undefined) {
                const val = Number(data[sizeAttr]);
                if (!Number.isNaN(val)) {
                    const size = scaleLinear(val, sizeExtent.min, sizeExtent.max, sizeMin, sizeMax);
                    style.width = size;
                    style.height = size;
                }
            }

            node.style(style);
        });

        lastLegendModel = lastLegendModel || {};
        lastLegendModel.nodeColor = colorAttr
            ? { attr: colorAttr, scale: colorScale, palette: els.nodePalette.value, extent: colorExtent, map: categoryMap }
            : null;
        lastLegendModel.nodeSize = sizeAttr ? { attr: sizeAttr, min: sizeMin, max: sizeMax, extent: sizeExtent } : null;
    }

    function updateEdgeStyle() {
        const colorAttr = els.edgeColor.value;
        const sizeAttr = els.edgeSize.value;
        const labelAttr = els.edgeLabel.value;
        const curve = els.curve.value;
        const showArrows = arrowsEnabled();
        const categoryMap = new Map();
        const colorScale = resolvedScale(els.edgeColorScale, cy.edges(), colorAttr);
        const colorExtent = numericExtent(collectValues(cy.edges(), colorAttr));
        const sizeExtent = numericExtent(collectValues(cy.edges(), sizeAttr));

        cy.edges().forEach((edge) => {
            const data = edge.data();
            const style = {
                width: 2,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': showArrows ? 'triangle' : 'none',
                'curve-style': curve,
                label: '',
                'font-size': '10px',
                'text-rotation': 'autorotate',
                color: '#444'
            };

            if (colorAttr && data[colorAttr] !== undefined && data[colorAttr] !== '') {
                const color = colorFor(data[colorAttr], colorScale, els.edgePalette.value, colorExtent, categoryMap);
                style['line-color'] = color;
                style['target-arrow-color'] = color;
            }

            if (sizeAttr && data[sizeAttr] !== undefined) {
                const val = Number(data[sizeAttr]);
                if (!Number.isNaN(val)) {
                    style.width = scaleLinear(val, sizeExtent.min, sizeExtent.max, 1, 10);
                }
            }

            if (labelAttr && data[labelAttr] !== undefined) {
                style.label = String(data[labelAttr]);
            }

            edge.style(style);
        });

        lastLegendModel = lastLegendModel || {};
        lastLegendModel.edgeColor = colorAttr
            ? { attr: colorAttr, scale: colorScale, palette: els.edgePalette.value, extent: colorExtent, map: categoryMap }
            : null;
    }

    function updateLegend() {
        const model = lastLegendModel || {};
        const blocks = [];

        function categoryItems(map) {
            const items = [...map.entries()];
            const extra = Math.max(0, items.length - 12);
            return { items: items.slice(0, 12), extra };
        }

        if (model.nodeColor) {
            const { attr, scale, palette, extent, map } = model.nodeColor;
            let body = '';
            if (scale === 'sequential') {
                const interpolator = getInterpolator(palette);
                const start = sequentialColor(interpolator, extent.min, extent.min, extent.max);
                const end = sequentialColor(interpolator, extent.max, extent.min, extent.max);
                body = `<div class="legend-gradient" style="background:linear-gradient(to right, ${start}, ${end})"></div>
                    <div class="legend-extent"><span>${escapeHtml(extent.min)}</span><span>${escapeHtml(extent.max)}</span></div>`;
            } else {
                const { items, extra } = categoryItems(map);
                body = items.map(([label, color]) =>
                    `<div class="legend-item"><span class="legend-swatch" style="background:${color}"></span>${escapeHtml(label)}</div>`
                ).join('');
                if (extra) body += `<div class="legend-item">${i18next.t('legendMore', { count: extra })}</div>`;
            }
            blocks.push(`<div class="legend-block"><div class="legend-title">${i18next.t('legendNodeColor')} · ${escapeHtml(attr)}</div>${body}</div>`);
        }

        if (model.nodeSize) {
            const { attr, min, max, extent } = model.nodeSize;
            const sizeBody = `<div class="legend-size-row">
                <span class="legend-size-dot" style="width:${Math.max(8, min / 2)}px;height:${Math.max(8, min / 2)}px"></span>
                <span>${escapeHtml(extent.min)}</span>
                <span class="legend-size-dot" style="width:${Math.min(22, max / 3)}px;height:${Math.min(22, max / 3)}px"></span>
                <span>${escapeHtml(extent.max)}</span>
            </div>`;
            blocks.push(`<div class="legend-block"><div class="legend-title">${i18next.t('legendNodeSize')} · ${escapeHtml(attr)}</div>${sizeBody}</div>`);
        }

        if (model.edgeColor) {
            const { attr, scale, palette, extent, map } = model.edgeColor;
            let body = '';
            if (scale === 'sequential') {
                const interpolator = getInterpolator(palette);
                const start = sequentialColor(interpolator, extent.min, extent.min, extent.max);
                const end = sequentialColor(interpolator, extent.max, extent.min, extent.max);
                body = `<div class="legend-gradient" style="background:linear-gradient(to right, ${start}, ${end})"></div>
                    <div class="legend-extent"><span>${escapeHtml(extent.min)}</span><span>${escapeHtml(extent.max)}</span></div>`;
            } else {
                const { items, extra } = categoryItems(map);
                body = items.map(([label, color]) =>
                    `<div class="legend-item"><span class="legend-swatch" style="background:${color}"></span>${escapeHtml(label)}</div>`
                ).join('');
                if (extra) body += `<div class="legend-item">${i18next.t('legendMore', { count: extra })}</div>`;
            }
            blocks.push(`<div class="legend-block"><div class="legend-title">${i18next.t('legendEdgeColor')} · ${escapeHtml(attr)}</div>${body}</div>`);
        }

        if (blocks.length === 0) {
            els.legend.hidden = true;
            els.legend.innerHTML = '';
            return;
        }
        els.legend.hidden = false;
        els.legend.innerHTML = blocks.join('');
    }

    function updateAnnotations() {
        const title = els.title.value.trim();
        const source = els.source.value.trim();
        els.chartTitle.hidden = !title;
        els.chartTitle.textContent = title;
        els.chartSource.hidden = !source;
        els.chartSource.textContent = source;
    }

    function updateSummary() {
        const nodes = cy.nodes().length;
        const edges = cy.edges().length;
        if (nodes === 0) {
            els.summary.textContent = i18next.t('summaryEmpty');
            return;
        }
        els.summary.textContent = i18next.t('summaryFilled', {
            nodes,
            edges,
            direction: i18next.t(isDirected() ? 'directedOption' : 'undirectedOption')
        });
    }

    function updateBackground() {
        document.body.classList.remove('bg-light', 'bg-dark');
        if (els.background.value === 'light') document.body.classList.add('bg-light');
        if (els.background.value === 'dark') document.body.classList.add('bg-dark');
        cy.container().style.backgroundColor = backgroundColor();
    }

    function updateAllVisuals() {
        els.labelTopN.disabled = els.labelMode.value !== 'top';
        updateBackground();
        updateNodeStyle();
        updateEdgeStyle();
        updateLegend();
        updateAnnotations();
        updateSummary();
    }

    function runLayout() {
        cy.layout({
            name: els.layout.value,
            animate: true,
            animationDuration: 1000,
            animationEasing: els.easing.value
        }).run();
    }

    function highlightNeighborhood(node) {
        cy.elements().addClass('faded');
        node.closedNeighborhood().removeClass('faded');
    }

    function afterGraphLoad(options = {}) {
        const { runLayoutAfter = true, fromCsv = false, skipMetrics = false } = options;
        pinnedNode = null;
        cy.elements().removeClass('faded');
        if (!skipMetrics) computeMetrics();
        extractAndPopulateAttributes();
        maybeAutoEncode(fromCsv);
        updateAllVisuals();
        if (runLayoutAfter) runLayout();
        if (cy.nodes().length > 4000 || cy.edges().length > 20000) {
            showToast(i18next.t('largeGraphWarning'), 'info', 5000);
        }
        requestAnimationFrame(() => cy.fit(undefined, 40));
    }

    function mountElements(nodes, edges) {
        const width = cy.width();
        const height = cy.height();
        const positioned = nodes.map((node) => ({
            ...node,
            position: {
                x: width / 2 + (Math.random() - 0.5) * width * 0.8,
                y: height / 2 + (Math.random() - 0.5) * height * 0.8
            }
        }));
        cy.elements().remove();
        cy.add(positioned.concat(edges));
    }

    function loadCSVData(content, options = {}) {
        const { interactive = false } = options;
        const rows = parseTable(content);
        if (rows.length < 2) {
            alert(i18next.t('csvEmptyError'));
            return;
        }
        if (interactive) {
            openCsvModal(content);
            return;
        }
        const headers = rows[0];
        const guessed = guessMapping(headers);
        if (guessed.sourceIdx < 0 || guessed.targetIdx < 0) {
            openCsvModal(content);
            return;
        }
        applyCsvMapping(rows, {
            sourceIdx: guessed.sourceIdx,
            targetIdx: guessed.targetIdx,
            weightIdx: guessed.weightIdx,
            aggregate: true,
            directed: false
        });
    }

    function applyCsvMapping(rows, mapping) {
        try {
            const graph = buildGraphFromEdgeRows(rows, {
                headers: rows[0],
                ...mapping
            });
            els.directed.value = mapping.directed ? 'directed' : 'undirected';
            els.arrows.checked = Boolean(mapping.directed);
            autoEncodeOnNextLoad = true;
            mountElements(graph.nodes, graph.edges);
            afterGraphLoad({ fromCsv: true });
            if (graph.duplicates > 0 && mapping.aggregate) {
                showToast(i18next.t('aggregatedNote', { count: graph.duplicates }), 'info', 3500);
            }
        } catch (error) {
            console.error(error);
            alert(i18next.t('csvParseError'));
        }
    }

    function fillMappingSelects(headers, guessed) {
        const fill = (select, selected, includeNone) => {
            select.innerHTML = '';
            if (includeNone) select.add(new Option(i18next.t('noneOption'), ''));
            headers.forEach((name, idx) => select.add(new Option(name, String(idx))));
            if (selected >= 0) select.value = String(selected);
        };
        fill(els.mapSource, guessed.sourceIdx, false);
        fill(els.mapTarget, guessed.targetIdx, false);
        fill(els.mapWeight, guessed.weightIdx, true);
    }

    function renderCsvPreview(rows) {
        const preview = rows.slice(0, 6);
        if (preview.length === 0) {
            els.csvPreview.innerHTML = '';
            return;
        }
        const header = preview[0];
        const body = preview.slice(1);
        els.csvPreview.innerHTML = `<table><thead><tr>${header.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${
            body.map((row) => `<tr>${header.map((_, i) => `<td>${escapeHtml(row[i] || '')}</td>`).join('')}</tr>`).join('')
        }</tbody></table>`;
    }

    function openCsvModal(content) {
        els.csvPaste.value = content || '';
        const rows = parseTable(els.csvPaste.value);
        const headers = rows[0] || [];
        fillMappingSelects(headers, guessMapping(headers));
        renderCsvPreview(rows);
        els.csvModal.classList.remove('hidden');
    }

    function closeCsvModal() {
        els.csvModal.classList.add('hidden');
    }

    function loadGraphData(content, isGraphML) {
        try {
            const graph = isGraphML
                ? graphologyLibrary.graphml.parse(graphology.MultiGraph, content)
                : graphologyLibrary.gexf.parse(graphology.MultiGraph, content);

            const width = cy.width();
            const height = cy.height();
            const elements = [];
            let hasPositions = 0;
            graph.forEachNode((node, attributes) => {
                const x = attributes.x;
                const y = attributes.y;
                if (typeof x === 'number' && typeof y === 'number') hasPositions += 1;
                elements.push({
                    group: 'nodes',
                    data: { id: node, label: attributes.label || node, ...attributes },
                    position: {
                        x: typeof x === 'number' ? x : width / 2 + (Math.random() - 0.5) * width * 0.8,
                        y: typeof y === 'number' ? y : height / 2 + (Math.random() - 0.5) * height * 0.8
                    }
                });
            });
            graph.forEachEdge((edge, attributes, source, target) => {
                const data = { id: edge, source, target, ...attributes };
                if (data.weight === undefined && attributes.Weight !== undefined) data.weight = attributes.Weight;
                elements.push({ group: 'edges', data });
            });

            const directedHint = graph.type === 'directed';
            els.directed.value = directedHint ? 'directed' : 'undirected';
            els.arrows.checked = directedHint;

            cy.elements().remove();
            cy.add(elements);
            autoEncodeOnNextLoad = true;
            const keepPositions = hasPositions > graph.order * 0.8;
            afterGraphLoad({ runLayoutAfter: !keepPositions });
        } catch (error) {
            console.error('Error parsing graph data:', error);
            alert(i18next.t('parseError'));
            throw error;
        }
    }

    function restoreProject(projectData) {
        autoEncodeOnNextLoad = false;
        let settings = null;
        let data = projectData;
        if (projectData && projectData.chartType === 'cytoscape' && projectData.data) {
            data = projectData.data;
            settings = projectData.settings;
        }
        cy.json(data);
        computeDegreeOnly();
        extractAndPopulateAttributes();
        applySettings(settings);
        updateAllVisuals();
    }

    function downloadSVG() {
        showProcessingToast(i18next.t('processingExport'));
        const svgContent = cy.svg({ scale: 1, full: true });
        triggerDownload(new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' }), 'network.svg');
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function drawLegendOnCanvas(ctx, x, y, maxWidth) {
        const model = lastLegendModel || {};
        ctx.save();
        ctx.font = '12px sans-serif';
        ctx.fillStyle = els.background.value === 'dark' ? '#eee' : '#333';
        let cursorY = y;
        const line = (text) => {
            ctx.fillText(text, x, cursorY);
            cursorY += 16;
        };

        const paintCategory = (title, map) => {
            line(title);
            [...map.entries()].slice(0, 12).forEach(([label, color]) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, cursorY - 10, 10, 10);
                ctx.fillStyle = els.background.value === 'dark' ? '#eee' : '#333';
                ctx.fillText(String(label), x + 16, cursorY);
                cursorY += 16;
            });
            cursorY += 8;
        };

        const paintSequential = (title, palette, extent) => {
            line(title);
            const interpolator = getInterpolator(palette);
            const grd = ctx.createLinearGradient(x, 0, x + Math.min(140, maxWidth), 0);
            grd.addColorStop(0, sequentialColor(interpolator, extent.min, extent.min, extent.max));
            grd.addColorStop(1, sequentialColor(interpolator, extent.max, extent.min, extent.max));
            ctx.fillStyle = grd;
            ctx.fillRect(x, cursorY - 8, Math.min(140, maxWidth), 10);
            cursorY += 8;
            ctx.fillStyle = els.background.value === 'dark' ? '#eee' : '#333';
            ctx.fillText(String(extent.min), x, cursorY + 8);
            ctx.fillText(String(extent.max), x + Math.min(110, maxWidth - 20), cursorY + 8);
            cursorY += 24;
        };

        if (model.nodeColor) {
            const { attr, scale, palette, extent, map } = model.nodeColor;
            if (scale === 'sequential') paintSequential(`${i18next.t('legendNodeColor')} · ${attr}`, palette, extent);
            else paintCategory(`${i18next.t('legendNodeColor')} · ${attr}`, map);
        }
        if (model.nodeSize) {
            line(`${i18next.t('legendNodeSize')} · ${model.nodeSize.attr}`);
            line(`${model.nodeSize.extent.min} – ${model.nodeSize.extent.max}`);
            cursorY += 4;
        }
        if (model.edgeColor) {
            const { attr, scale, palette, extent, map } = model.edgeColor;
            if (scale === 'sequential') paintSequential(`${i18next.t('legendEdgeColor')} · ${attr}`, palette, extent);
            else paintCategory(`${i18next.t('legendEdgeColor')} · ${attr}`, map);
        }
        ctx.restore();
        return cursorY;
    }

    async function downloadPNG() {
        showProcessingToast(i18next.t('processingExport'));
        const bg = backgroundColor();
        const blob = cy.png({ output: 'blob', full: true, scale: 2, bg: bg });
        const img = await blobToImage(blob);
        const title = els.title.value.trim();
        const source = els.source.value.trim();
        const padTop = title ? 64 : 28;
        const padBottom = source ? 48 : 28;
        const legendWidth = 200;
        const canvas = document.createElement('canvas');
        canvas.width = img.width + legendWidth + 48;
        canvas.height = img.height + padTop + padBottom;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = els.background.value === 'dark' ? '#f3f4f6' : '#111';
        ctx.font = 'bold 28px sans-serif';
        if (title) ctx.fillText(title, 24, 40);
        ctx.drawImage(img, 20, padTop);
        drawLegendOnCanvas(ctx, img.width + 32, padTop + 12, legendWidth - 16);
        if (source) {
            ctx.font = '16px sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.fillText(source, 24, canvas.height - 18);
        }
        canvas.toBlob((out) => {
            if (out) triggerDownload(out, 'network.png');
        }, 'image/png');
    }

    function showToast(message, type = 'info', duration = 3000) {
        const toolHeader = document.querySelector('dataviz-tool-header');
        if (toolHeader && toolHeader.showMessage) {
            toolHeader.showMessage(message, type, duration);
            return;
        }
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function showProcessingToast(message) {
        showToast(message || i18next.t('processingGeneric'), 'info', 5000);
    }

    function installHeaderProcessingToasts(header) {
        if (!header || header.__dvzProcessingToastsInstalled === '1') return;
        if (typeof header.showLoadModal === 'function') {
            const original = header.showLoadModal.bind(header);
            header.showLoadModal = (...args) => {
                showProcessingToast(i18next.t('processingProjectList'));
                return original(...args);
            };
        }
        if (typeof header.loadProject === 'function') {
            const original = header.loadProject.bind(header);
            header.loadProject = (...args) => {
                showProcessingToast(i18next.t('processingProjectLoad'));
                return original(...args);
            };
        }
        if (typeof header.saveProject === 'function') {
            const original = header.saveProject.bind(header);
            header.saveProject = (...args) => {
                showProcessingToast(i18next.t('processingProjectSave'));
                return original(...args);
            };
        }
        header.__dvzProcessingToastsInstalled = '1';
    }

    function tooltipHtml(ele) {
        const data = ele.data();
        const skip = new Set(['id', 'source', 'target']);
        const title = ele.isNode()
            ? escapeHtml(data.label || data.id)
            : `${escapeHtml(ele.source().id())} → ${escapeHtml(ele.target().id())}`;
        const rows = Object.keys(data)
            .filter((key) => !skip.has(key) && data[key] !== undefined && data[key] !== '')
            .slice(0, 12)
            .map((key) => `<div class="tip-row"><span class="tip-key">${escapeHtml(key)}</span><span>${escapeHtml(data[key])}</span></div>`);
        return `<strong>${title}</strong>${rows.join('')}`;
    }

    function placeTooltip(event) {
        const pad = 14;
        const x = event.originalEvent.clientX + pad;
        const y = event.originalEvent.clientY + pad;
        els.tooltip.style.left = `${Math.min(x, window.innerWidth - 300)}px`;
        els.tooltip.style.top = `${Math.min(y, window.innerHeight - 80)}px`;
    }

    els.layout.addEventListener('change', runLayout);
    els.easing.addEventListener('change', runLayout);
    [
        els.nodeColor, els.nodeColorScale, els.nodePalette, els.nodeSize, els.nodeSizeMin, els.nodeSizeMax,
        els.nodeLabel, els.labelMode, els.labelTopN, els.edgeColor, els.edgeColorScale, els.edgePalette,
        els.edgeSize, els.edgeLabel, els.curve
    ].forEach((el) => el.addEventListener('change', updateAllVisuals));
    els.directed.addEventListener('change', () => {
        if (isDirected()) els.arrows.checked = true;
        else els.arrows.checked = false;
        updateAllVisuals();
    });
    els.arrows.addEventListener('change', updateAllVisuals);
    els.background.addEventListener('change', updateAllVisuals);
    els.title.addEventListener('input', updateAnnotations);
    els.source.addEventListener('input', updateAnnotations);
    document.getElementById('fit-btn').addEventListener('click', () => cy.fit(undefined, 40));
    document.getElementById('toggle-controls-btn').addEventListener('click', () => {
        document.getElementById('controls').classList.toggle('collapsed');
    });
    document.getElementById('paste-csv-btn').addEventListener('click', () => openCsvModal(''));
    document.getElementById('csv-cancel').addEventListener('click', closeCsvModal);
    document.getElementById('csv-apply').addEventListener('click', () => {
        const rows = parseTable(els.csvPaste.value);
        applyCsvMapping(rows, {
            sourceIdx: Number(els.mapSource.value),
            targetIdx: Number(els.mapTarget.value),
            weightIdx: els.mapWeight.value === '' ? -1 : Number(els.mapWeight.value),
            aggregate: els.mapAggregate.checked,
            directed: els.mapDirected.checked
        });
        closeCsvModal();
    });
    els.csvPaste.addEventListener('input', () => {
        const rows = parseTable(els.csvPaste.value);
        const headers = rows[0] || [];
        fillMappingSelects(headers, guessMapping(headers));
        renderCsvPreview(rows);
    });
    document.getElementById('export-png-btn').addEventListener('click', () => {
        els.exportModal.classList.add('hidden');
        downloadPNG();
    });
    document.getElementById('export-svg-btn').addEventListener('click', () => {
        els.exportModal.classList.add('hidden');
        downloadSVG();
    });
    document.getElementById('export-cancel').addEventListener('click', () => {
        els.exportModal.classList.add('hidden');
    });

    cy.on('mouseover', 'node, edge', (event) => {
        els.tooltip.hidden = false;
        els.tooltip.innerHTML = tooltipHtml(event.target);
        placeTooltip(event);
    });
    cy.on('mousemove', 'node, edge', placeTooltip);
    cy.on('mouseout', 'node, edge', () => {
        els.tooltip.hidden = true;
    });
    cy.on('tap', 'node', (event) => {
        pinnedNode = event.target;
        highlightNeighborhood(pinnedNode);
        if (els.labelMode.value === 'selected') updateNodeStyle();
    });
    cy.on('tap', (event) => {
        if (event.target === cy) {
            pinnedNode = null;
            cy.elements().removeClass('faded');
            if (els.labelMode.value === 'selected') updateNodeStyle();
        }
    });

    els.sample.addEventListener('change', async function () {
        const datasetKey = this.value;
        try {
            this.disabled = true;
            const url = sampleDatasets[datasetKey];
            const response = await fetch(url);
            if (!response.ok) throw new Error(response.statusText);
            const content = await response.text();
            if (url.endsWith('.csv')) loadCSVData(content, { interactive: false });
            else loadGraphData(content, url.endsWith('.graphml'));
            this.disabled = false;
        } catch (error) {
            console.error(`Error loading ${datasetKey} dataset:`, error);
            if (!String(error.message || '').includes('Failed to parse')) {
                alert(i18next.t('datasetLoadError'));
            }
            this.value = '';
            this.disabled = false;
        }
    });

    els.fileUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        showProcessingToast(i18next.t('processingFile'));
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            try {
                const name = file.name.toLowerCase();
                if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) {
                    loadCSVData(content, { interactive: true });
                } else if (name.endsWith('.gexf')) {
                    loadGraphData(content, false);
                } else if (name.endsWith('.graphml')) {
                    loadGraphData(content, true);
                } else {
                    alert(i18next.t('uploadError'));
                }
                els.fileUpload.value = '';
            } catch (error) {
                console.error('Error processing uploaded file:', error);
            }
        };
        reader.readAsText(file);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const dataUrl = urlParams.get('data_url');
    const urlProjectId = urlParams.get('projectId') || urlParams.get('project_id');

    if (dataUrl) {
        showProcessingToast(i18next.t('processingSample'));
        fetch(dataUrl)
            .then((res) => res.text())
            .then((content) => {
                if (dataUrl.endsWith('.graphml')) loadGraphData(content, true);
                else if (dataUrl.endsWith('.gexf')) loadGraphData(content, false);
                else if (dataUrl.endsWith('.csv') || dataUrl.endsWith('.tsv')) {
                    loadCSVData(content, { interactive: false });
                }
            })
            .catch((err) => console.error('data_url load failed:', err));
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlProjectId) {
        setTimeout(async () => {
            try {
                const toolHeader = document.querySelector('dataviz-tool-header');
                if (toolHeader && toolHeader.loadProject) {
                    installHeaderProcessingToasts(toolHeader);
                    const projectData = await toolHeader.loadProject(urlProjectId);
                    restoreProject(projectData);
                    currentProjectId = urlProjectId;
                }
            } catch (e) {
                console.log('Auto-load failed (likely auth or invalid ID):', e);
            }
        }, 1000);
    }

    if (!dataUrl && !urlProjectId) {
        window.addEventListener('load', function () {
            els.sample.dispatchEvent(new Event('change'));
        });
    }

    customElements.whenDefined('dataviz-tool-header').then(() => {
        const toolHeader = document.querySelector('dataviz-tool-header');
        if (!toolHeader) {
            console.error('dataviz-tool-header element not found in DOM.');
            return;
        }
        installHeaderProcessingToasts(toolHeader);
        toolHeader.setProjectConfig({
            appName: 'cytoscape',
            onProjectLoad: (projectData) => {
                restoreProject(projectData);
                showToast(i18next.t('loadSuccess'), 'success');
            },
            onProjectSave: (meta) => {
                currentProjectId = meta.id;
                currentProjectName = meta.name;
            },
            onProjectDelete: (projectId) => {
                if (currentProjectId === projectId) {
                    currentProjectId = null;
                    currentProjectName = null;
                }
            }
        });

        toolHeader.setConfig({
            logo: {
                type: 'text',
                text: 'Cytoscape Network Viz',
                textClass: 'font-bold text-lg text-white'
            },
            backgroundColor: '#2c3e50',
            buttons: [
                {
                    label: i18next.t('btnLoadFile'),
                    action: () => els.fileUpload.click(),
                    align: 'left'
                },
                {
                    label: i18next.t('btnLoadProject'),
                    action: () => toolHeader.showLoadModal(),
                    align: 'right'
                },
                {
                    label: i18next.t('btnSaveProject'),
                    action: () => {
                        showProcessingToast(i18next.t('processingSavePrep'));
                        const thumbnailDataUri = cy.png({ output: 'base64uri', full: true, scale: 0.5, maxWidth: 600 });
                        toolHeader.showSaveModal({
                            name: currentProjectName,
                            data: captureState(),
                            thumbnailDataUri,
                            existingProjectId: currentProjectId
                        });
                    },
                    align: 'right'
                },
                {
                    label: i18next.t('btnExport'),
                    action: () => els.exportModal.classList.remove('hidden'),
                    align: 'right'
                }
            ]
        });

        toolHeader.setSampleConfig({
            toolId: 'cytoscape',
            onSampleSelect: function (detail) {
                showProcessingToast(i18next.t('processingSample'));
                fetch(detail.url)
                    .then((res) => res.text())
                    .then((content) => {
                        if (detail.format === 'graphml') loadGraphData(content, true);
                        else if (detail.format === 'gexf') loadGraphData(content, false);
                        else if (detail.format === 'csv') loadCSVData(content, { interactive: false });
                    });
            }
        });
    });

    computeMetrics();
    extractAndPopulateAttributes();
    maybeAutoEncode(false);
    updateAllVisuals();
});

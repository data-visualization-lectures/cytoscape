// i18next initialization
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
                csvParseError: 'CSVの解析に失敗しました。先頭行に "source"/"from" と "target"/"to" 列が必要です。',
                csvEmptyError: 'CSVファイルにデータ行がありません。',
                loadError: 'データセットの読み込みに失敗しました。インターネット接続を確認してください。',
                deleteConfirm: '「{{name}}」を削除してもよろしいですか？',
                loginRequired: '{{action}}するにはログインしてください。',
                saveSuccess: 'プロジェクトを保存しました！',
                loadSuccess: 'プロジェクトを読み込みました！',
                deleteSuccess: 'プロジェクトを削除しました。',
                loginToSave: 'プロジェクトを保存するにはログインしてください。',
                loginToLoad: 'プロジェクトを読み込むにはログインしてください。',
                enterProjectName: 'プロジェクト名を入力してください。',
                saveFailed: 'プロジェクトの保存に失敗しました。',
                loadFailed: 'プロジェクトの読み込みに失敗しました。',
                deleteFailed: 'プロジェクトの削除に失敗しました。',
                noProjects: '保存されたプロジェクトはありません。',
                btnLoadFile: 'データファイルの読込',
                btnLoadSample: 'サンプルデータの読込',
                btnLoadProject: 'プロジェクトの読込',
                btnSaveProject: 'プロジェクトの保存',
                btnExport: 'エクスポート',
                saving: '保存中...',
                save: '保存',
                cancel: 'キャンセル',
                close: '閉じる',
                saveTitle: 'プロジェクトの保存',
                loadTitle: 'プロジェクトの読込',
                projectNamePlaceholder: 'プロジェクト名',
                loadingProjects: 'プロジェクトを読み込み中...',
                checking: '確認中...',
                noImg: '画像なし',
                imgErr: 'エラー',
                loadFromServer: 'サーバーから読み込み',
                loading: '読み込み中...',
                datasetLoadError: 'データセットの読み込みに失敗しました。インターネット接続を確認してください。',
                serverLoadBtn: 'サーバーから読込',
                deleteBtn: '削除',
                nodeGroupLabel: 'ノード',
                edgeGroupLabel: 'エッジ',
                edgeColorLabel: '色:',
                edgeSizeLabel: '太さ:',
                edgeLabelLabel: 'ラベル:'
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
                csvParseError: 'Failed to parse CSV. The header row must contain "source"/"from" and "target"/"to" columns.',
                csvEmptyError: 'The CSV file contains no data rows.',
                loadError: 'Failed to load dataset. Please check your internet connection.',
                deleteConfirm: 'Are you sure you want to delete "{{name}}"?',
                loginRequired: 'Please log in to {{action}}.',
                saveSuccess: 'Project saved successfully!',
                loadSuccess: 'Project loaded!',
                deleteSuccess: 'Project deleted.',
                loginToSave: 'Please log in to save projects.',
                loginToLoad: 'Please log in to load projects.',
                enterProjectName: 'Please enter a project name.',
                saveFailed: 'Failed to save project.',
                loadFailed: 'Failed to load project.',
                deleteFailed: 'Failed to delete project.',
                noProjects: 'No saved projects found.',
                btnLoadFile: 'Load Data File',
                btnLoadSample: 'Load Sample Data',
                btnLoadProject: 'Load Project',
                btnSaveProject: 'Save Project',
                btnExport: 'Export',
                saving: 'Saving...',
                save: 'Save',
                cancel: 'Cancel',
                close: 'Close',
                saveTitle: 'Save Project',
                loadTitle: 'Load Project',
                projectNamePlaceholder: 'Project Name',
                loadingProjects: 'Loading projects...',
                checking: 'Checking...',
                noImg: 'No Img',
                imgErr: 'Err',
                loadFromServer: 'Load from Server',
                loading: 'Loading...',
                datasetLoadError: 'Failed to load dataset. Please check your internet connection.',
                serverLoadBtn: 'Server Load',
                deleteBtn: 'Delete',
                nodeGroupLabel: 'Node',
                edgeGroupLabel: 'Edge',
                edgeColorLabel: 'Color:',
                edgeSizeLabel: 'Width:',
                edgeLabelLabel: 'Label:'
            }
        }
    }
}, function() {
    initializeUI();
});

function initializeUI() {
    document.getElementById('pageTitle').textContent = i18next.t('pageTitle');
    document.getElementById('layoutLabel').textContent = i18next.t('layoutLabel');
    document.getElementById('easingLabel').textContent = i18next.t('easingLabel');
    document.getElementById('colorLabel').textContent = i18next.t('colorLabel');
    document.getElementById('sizeLabel').textContent = i18next.t('sizeLabel');
    document.getElementById('labelLabel').textContent = i18next.t('labelLabel');
    document.getElementById('sampleLabel').textContent = i18next.t('sampleLabel');
    document.getElementById('nodeGroupLabel').textContent = i18next.t('nodeGroupLabel');
    document.getElementById('edgeGroupLabel').textContent = i18next.t('edgeGroupLabel');
    document.getElementById('edgeColorLabel').textContent = i18next.t('edgeColorLabel');
    document.getElementById('edgeSizeLabel').textContent = i18next.t('edgeSizeLabel');
    document.getElementById('edgeLabelLabel').textContent = i18next.t('edgeLabelLabel');
}


document.addEventListener('DOMContentLoaded', function () {
    const cy = cytoscape({
        container: document.getElementById('cy'),

        elements: [
            // Nodes
            { data: { id: 'a', label: 'Node A', category: 'A', score: 10 } },
            { data: { id: 'b', label: 'Node B', category: 'A', score: 20 } },
            { data: { id: 'c', label: 'Node C', category: 'B', score: 30 } },
            { data: { id: 'd', label: 'Node D', category: 'B', score: 40 } },
            { data: { id: 'e', label: 'Node E', category: 'C', score: 50 } },
            { data: { id: 'f', label: 'Node F', category: 'C', score: 60 } },
            { data: { id: 'g', label: 'Node G', category: 'C', score: 70 } },

            // Edges
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
                    'width': '30px',
                    'height': '30px',
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
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],

        layout: {
            name: 'grid',
            rows: 2
        }
    });

    const layoutSelect = document.getElementById('layout-select');
    const easingSelect = document.getElementById('easing-select');
    const colorSelect = document.getElementById('node-color-select');
    const sizeSelect = document.getElementById('node-size-select');
    const labelSelect = document.getElementById('node-label-select');
    const edgeColorSelect = document.getElementById('edge-color-select');
    const edgeSizeSelect = document.getElementById('edge-size-select');
    const edgeLabelSelect = document.getElementById('edge-label-select');
    const sampleDatasetSelect = document.getElementById('sample-dataset-select');
    const fileUpload = document.getElementById('file-upload');

    function updateLayout() {
        const layoutName = layoutSelect.value;
        const easingName = easingSelect.value;
        cy.layout({
            name: layoutName,
            animate: true,
            animationDuration: 1000,
            animationEasing: easingName
        }).run();
    }

    layoutSelect.addEventListener('change', updateLayout);
    easingSelect.addEventListener('change', updateLayout);

    // Qualitative color scheme for nodes (categorical)
    const qualitativeScheme = d3.schemeCategory10;
    const categoryColorMap = new Map();
    function getCategoryColor(val) {
        const key = String(val);
        if (!categoryColorMap.has(key)) {
            categoryColorMap.set(key, qualitativeScheme[categoryColorMap.size % qualitativeScheme.length]);
        }
        return categoryColorMap.get(key);
    }

    // Quantitative color scheme for edges (sequential)
    function getSequentialColor(val, min, max) {
        if (max === min) return d3.interpolateBlues(0.5);
        const t = (val - min) / (max - min);
        return d3.interpolateBlues(0.2 + t * 0.8); // 0.2-1.0 range to avoid too-light colors
    }

    // Style update function
    function updateNodeStyle() {
        categoryColorMap.clear();
        const colorAttr = colorSelect.value;
        const sizeAttr = sizeSelect.value;
        const labelAttr = labelSelect.value;

        cy.nodes().forEach(node => {
            const data = node.data();
            let style = {};

            // Reset to default
            style['background-color'] = '#666';
            style['width'] = 30;
            style['height'] = 30;
            style['label'] = data.label || data.id;
            style['text-outline-color'] = '#666';
            style['font-size'] = '12px'; // Ensure uniform font size

            // Apply label
            if (labelAttr && data[labelAttr] !== undefined) {
                style['label'] = data[labelAttr];
            }

            // Apply color (qualitative scheme)
            if (colorAttr && data[colorAttr] !== undefined) {
                const color = getCategoryColor(data[colorAttr]);
                style['background-color'] = color;
                style['text-outline-color'] = color;
            }

            // Apply size
            if (sizeAttr && data[sizeAttr] !== undefined) {
                const val = Number(data[sizeAttr]);
                if (!isNaN(val)) {
                    // Find min/max for this attribute
                    let min = Infinity;
                    let max = -Infinity;
                    cy.nodes().forEach(n => {
                        const v = Number(n.data(sizeAttr));
                        if (!isNaN(v)) {
                            if (v < min) min = v;
                            if (v > max) max = v;
                        }
                    });

                    // Normalize and map to 20-80px
                    if (max === min) {
                        style['width'] = 30;
                        style['height'] = 30;
                    } else {
                        const size = 20 + ((val - min) / (max - min)) * 60;
                        style['width'] = size;
                        style['height'] = size;
                    }
                }
            }

            node.style(style);
        });
    }

    // Edge style update function
    function updateEdgeStyle() {
        const colorAttr = edgeColorSelect.value;
        const sizeAttr = edgeSizeSelect.value;
        const labelAttr = edgeLabelSelect.value;

        // Pre-compute min/max for color attribute
        let edgeColorMin = Infinity;
        let edgeColorMax = -Infinity;
        if (colorAttr) {
            cy.edges().forEach(e => {
                const v = Number(e.data(colorAttr));
                if (!isNaN(v)) {
                    if (v < edgeColorMin) edgeColorMin = v;
                    if (v > edgeColorMax) edgeColorMax = v;
                }
            });
        }

        cy.edges().forEach(edge => {
            const data = edge.data();
            let style = {};

            // Reset to default
            style['width'] = 1;
            style['line-color'] = '#ccc';
            style['label'] = '';

            // Apply color (quantitative scheme)
            if (colorAttr && data[colorAttr] !== undefined) {
                const val = Number(data[colorAttr]);
                if (!isNaN(val)) {
                    style['line-color'] = getSequentialColor(val, edgeColorMin, edgeColorMax);
                }
            }

            // Apply size (edge width)
            if (sizeAttr && data[sizeAttr] !== undefined) {
                const val = Number(data[sizeAttr]);
                if (!isNaN(val)) {
                    let min = Infinity;
                    let max = -Infinity;
                    cy.edges().forEach(e => {
                        const v = Number(e.data(sizeAttr));
                        if (!isNaN(v)) {
                            if (v < min) min = v;
                            if (v > max) max = v;
                        }
                    });
                    if (max === min) {
                        style['width'] = 2;
                    } else {
                        style['width'] = 1 + ((val - min) / (max - min)) * 9;
                    }
                }
            }

            // Apply label
            if (labelAttr && data[labelAttr] !== undefined) {
                style['label'] = data[labelAttr];
                style['font-size'] = '10px';
                style['text-rotation'] = 'autorotate';
            }

            edge.style(style);
        });
    }

    // Bind events
    colorSelect.onchange = updateNodeStyle;
    sizeSelect.onchange = updateNodeStyle;
    labelSelect.onchange = updateNodeStyle;
    edgeColorSelect.onchange = updateEdgeStyle;
    edgeSizeSelect.onchange = updateEdgeStyle;
    edgeLabelSelect.onchange = updateEdgeStyle;

    function extractAndPopulateAttributes() {
        // Node attributes
        const nodeAttributes = new Set();
        cy.nodes().forEach(node => {
            const attributes = node.data();
            Object.keys(attributes).forEach(key => {
                if (key !== 'id' && key !== 'label' && key !== 'x' && key !== 'y') {
                    nodeAttributes.add(key);
                }
            });
        });

        const currentColor = colorSelect.value;
        const currentSize = sizeSelect.value;
        const currentLabel = labelSelect.value;

        while (colorSelect.options.length > 1) colorSelect.remove(1);
        while (sizeSelect.options.length > 1) sizeSelect.remove(1);
        while (labelSelect.options.length > 1) labelSelect.remove(1);

        nodeAttributes.forEach(attr => {
            colorSelect.add(new Option(attr, attr));
            sizeSelect.add(new Option(attr, attr));
            labelSelect.add(new Option(attr, attr));
        });

        if (nodeAttributes.has(currentColor)) colorSelect.value = currentColor;
        if (nodeAttributes.has(currentSize)) sizeSelect.value = currentSize;
        if (nodeAttributes.has(currentLabel)) labelSelect.value = currentLabel;

        // Edge attributes
        const edgeAttributes = new Set();
        cy.edges().forEach(edge => {
            const attributes = edge.data();
            Object.keys(attributes).forEach(key => {
                if (key !== 'id' && key !== 'source' && key !== 'target') {
                    edgeAttributes.add(key);
                }
            });
        });

        const currentEdgeColor = edgeColorSelect.value;
        const currentEdgeSize = edgeSizeSelect.value;
        const currentEdgeLabel = edgeLabelSelect.value;

        while (edgeColorSelect.options.length > 1) edgeColorSelect.remove(1);
        while (edgeSizeSelect.options.length > 1) edgeSizeSelect.remove(1);
        while (edgeLabelSelect.options.length > 1) edgeLabelSelect.remove(1);

        edgeAttributes.forEach(attr => {
            edgeColorSelect.add(new Option(attr, attr));
            edgeSizeSelect.add(new Option(attr, attr));
            edgeLabelSelect.add(new Option(attr, attr));
        });

        if (edgeAttributes.has(currentEdgeColor)) edgeColorSelect.value = currentEdgeColor;
        if (edgeAttributes.has(currentEdgeSize)) edgeSizeSelect.value = currentEdgeSize;
        if (edgeAttributes.has(currentEdgeLabel)) edgeLabelSelect.value = currentEdgeLabel;
    }

    // CSV parser (handles quoted fields, BOM, CRLF/LF)
    function parseCSV(text) {
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }
        const rows = [];
        let current = '';
        let inQuotes = false;
        let row = [];
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < text.length && text[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    row.push(current.trim());
                    current = '';
                } else if (ch === '\r') {
                    // skip
                } else if (ch === '\n') {
                    row.push(current.trim());
                    current = '';
                    if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
                        rows.push(row);
                    }
                    row = [];
                } else {
                    current += ch;
                }
            }
        }
        row.push(current.trim());
        if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
            rows.push(row);
        }
        return rows;
    }

    // Load graph from CSV edge list (source, target, ...attributes)
    function loadCSVData(content) {
        const rows = parseCSV(content);
        if (rows.length < 2) {
            alert(i18next.t('csvEmptyError'));
            return;
        }
        const headers = rows[0];
        const headerLower = headers.map(h => h.toLowerCase());
        const sourceIdx = headerLower.findIndex(h => h === 'source' || h === 'from');
        const targetIdx = headerLower.findIndex(h => h === 'target' || h === 'to');
        if (sourceIdx === -1 || targetIdx === -1) {
            alert(i18next.t('csvParseError'));
            return;
        }
        const elements = [];
        const nodeSet = new Set();
        const extraHeaders = headers.filter((_, i) => i !== sourceIdx && i !== targetIdx);
        const extraIndices = headers.map((_, i) => i).filter(i => i !== sourceIdx && i !== targetIdx);

        for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            const source = row[sourceIdx];
            const target = row[targetIdx];
            if (!source || !target) continue;
            nodeSet.add(source);
            nodeSet.add(target);
            const edgeData = { id: 'e' + r, source: source, target: target };
            extraIndices.forEach((colIdx, i) => {
                if (row[colIdx] !== undefined && row[colIdx] !== '') {
                    const val = row[colIdx];
                    const num = Number(val);
                    edgeData[extraHeaders[i]] = isNaN(num) ? val : num;
                }
            });
            elements.push({ group: 'edges', data: edgeData });
        }

        const containerWidth = cy.width();
        const containerHeight = cy.height();
        nodeSet.forEach(nodeId => {
            elements.push({
                group: 'nodes',
                data: { id: nodeId, label: nodeId },
                position: {
                    x: containerWidth / 2 + (Math.random() - 0.5) * containerWidth * 0.8,
                    y: containerHeight / 2 + (Math.random() - 0.5) * containerHeight * 0.8
                },
                style: { 'background-color': '#666', 'width': 30, 'height': 30, 'label': nodeId }
            });
        });

        cy.elements().remove();
        cy.add(elements);
        extractAndPopulateAttributes();
        updateNodeStyle();
        updateEdgeStyle();
        const layoutName = layoutSelect.value;
        const easingName = easingSelect.value;
        cy.layout({ name: layoutName, animate: true, animationEasing: easingName }).run();
    }

    // Common function to process graph data
    function loadGraphData(content, isGraphML) {
        try {
            // Parse based on format (returns a MultiGraph)
            const graph = isGraphML
                ? graphologyLibrary.graphml.parse(graphology.MultiGraph, content)
                : graphologyLibrary.gexf.parse(graphology.MultiGraph, content);

            const elements = [];

            // Convert nodes
            const containerWidth = cy.width();
            const containerHeight = cy.height();

            graph.forEachNode((node, attributes) => {
                elements.push({
                    group: 'nodes',
                    data: {
                        id: node,
                        label: attributes.label || node,
                        ...attributes
                    },
                    position: {
                        x: attributes.x || (containerWidth / 2 + (Math.random() - 0.5) * containerWidth * 0.8),
                        y: attributes.y || (containerHeight / 2 + (Math.random() - 0.5) * containerHeight * 0.8)
                    },
                    style: {
                        'background-color': '#666',
                        'width': 30,
                        'height': 30,
                        'label': attributes.label || node
                    }
                });
            });

            // Convert edges
            graph.forEachEdge((edge, attributes, source, target) => {
                elements.push({
                    group: 'edges',
                    data: {
                        id: edge,
                        source: source,
                        target: target,
                        ...attributes
                    }
                });
            });

            // Update Cytoscape
            cy.elements().remove();
            cy.add(elements);

            // Update attributes and styles
            extractAndPopulateAttributes();
            updateNodeStyle();
            updateEdgeStyle();

            // Apply layout
            const layoutName = layoutSelect.value;
            const easingName = easingSelect.value;
            cy.layout({ name: layoutName, animate: true, animationEasing: easingName }).run();

        } catch (error) {
            console.error('Error parsing graph data:', error);
            alert(i18next.t('parseError'));
            throw error; // Re-throw to handle specific UI resets in caller
        }
    }

    // Initialize with default data
    extractAndPopulateAttributes();
    updateNodeStyle();
    updateEdgeStyle();


    // SVG Export Function
    function downloadSVG() {
        const svgContent = cy.svg({ scale: 1, full: true });
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });

        if (window.location.protocol === 'file:') {
            // Fallback for local file protocol to avoid blob:null
            const reader = new FileReader();
            reader.onload = function (e) {
                const link = document.createElement('a');
                link.href = e.target.result;
                link.download = 'network.svg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);
        } else {
            // Standard Blob URL method
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'network.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    // Sample datasets (local GEXF and GraphML files)
    const sampleDatasets = {
        'eurosis': 'data/samples/eurosis.gexf',
        'diseasome': 'data/samples/diseasome.gexf',
        'celegans': 'data/samples/celegans.gexf',
        'java': 'data/samples/java.gexf',
        'lesmis': 'data/samples/les-miserables.gexf',
        'powergrid': 'data/samples/power-grid.gexf',
        'got': 'data/samples/game-of-thrones.graphml',
        'marvel': 'data/samples/marvel.graphml',
        'quakers': 'data/samples/quakers.graphml'
    };

    sampleDatasetSelect.addEventListener('change', async function () {
        const datasetKey = this.value;

        try {
            // Show loading state
            this.disabled = true;

            const url = sampleDatasets[datasetKey];
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch dataset: ${response.statusText}`);
            }

            // Get the file content
            const content = await response.text();

            // Detect file format based on URL extension
            const isGraphML = url.endsWith('.graphml');

            loadGraphData(content, isGraphML);

            // Re-enable dropdown on success
            this.disabled = false;

        } catch (error) {
            console.error(`Error loading ${datasetKey} dataset:`, error);
            if (!error.message.includes('Failed to parse')) { // Prevent double alert if parsing failed
                alert(i18next.t('datasetLoadError'));
            }
            this.value = '';
            this.disabled = false;
        }
    });

    // Auto-load the default dataset (Les Misérables) on page load
    window.addEventListener('load', function () {
        // Trigger the change event to load the default selected dataset
        sampleDatasetSelect.dispatchEvent(new Event('change'));
    });

    fileUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            try {
                if (file.name.endsWith('.csv')) {
                    loadCSVData(content);
                } else if (file.name.endsWith('.gexf')) {
                    loadGraphData(content, false);
                } else if (file.name.endsWith('.graphml')) {
                    loadGraphData(content, true);
                } else {
                    alert(i18next.t('uploadError'));
                    return;
                }

                // Clear the input so the same file can be selected again if needed
                fileUpload.value = '';

            } catch (error) {
                console.error('Error processing uploaded file:', error);
                // Alert already handled in loadGraphData
            }
        };
        reader.readAsText(file);
    });



    // ==========================================
    // Project Management State
    // ==========================================

    let currentProjectId = null;
    let currentProjectName = null;

    // --- Toast Notification Helper ---
    function showToast(message, type = 'info') {
        const toolHeader = document.querySelector('dataviz-tool-header');
        if (toolHeader && toolHeader.showMessage) {
            toolHeader.showMessage(message, type, 3000);
            return;
        }

        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger reflow for animation
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }



    // --- URL Parameter Auto-Load ---
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = urlParams.get('project_id');
    if (urlProjectId) {
        setTimeout(async () => {
            try {
                const toolHeader = document.querySelector('dataviz-tool-header');
                if (toolHeader && toolHeader.loadProject) {
                    const projectData = await toolHeader.loadProject(urlProjectId);
                    cy.json(projectData);
                    extractAndPopulateAttributes();
                    currentProjectId = urlProjectId;
                }
            } catch (e) {
                console.log("Auto-load failed (likely auth or invalid ID):", e);
            }
        }, 1000);
    }

    // --- Dataviz Tool Header Integration ---
    console.log('Waiting for dataviz-tool-header...');
    customElements.whenDefined('dataviz-tool-header').then(() => {
        console.log('dataviz-tool-header defined.');
        const toolHeader = document.querySelector('dataviz-tool-header');
        console.log('Found toolHeader:', toolHeader);
        if (toolHeader) {
            // Configure project management
            toolHeader.setProjectConfig({
                appName: 'cytoscape',
                onProjectLoad: (projectData) => {
                    cy.json(projectData);
                    extractAndPopulateAttributes();
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

            // Define button handlers
            const handleSave = () => {
                const thumbnailDataUri = cy.png({ output: 'base64uri', full: true, scale: 0.5, maxWidth: 600 });
                const data = cy.json();
                toolHeader.showSaveModal({
                    name: currentProjectName,
                    data: data,
                    thumbnailDataUri: thumbnailDataUri,
                    existingProjectId: currentProjectId,
                });
            };
            const handleLoad = () => { toolHeader.showLoadModal(); };
            const handleFileLoad = () => { if (fileUpload) fileUpload.click(); };
            const loadSample = (key) => {
                if (sampleDatasetSelect) {
                    sampleDatasetSelect.value = key;
                    sampleDatasetSelect.dispatchEvent(new Event('change'));
                }
            };

            console.log('Calling setConfig...');
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
                        action: handleFileLoad,
                        align: 'left'
                    },
                    {
                        label: i18next.t('btnLoadSample'),
                        type: 'dropdown',
                        align: 'left',
                        items: [
                            { label: 'Les Misérables', action: () => loadSample('lesmis') },
                            { label: 'Game of Thrones', action: () => loadSample('got') },
                            { label: 'Marvel Universe', action: () => loadSample('marvel') },
                            { label: 'Quakers', action: () => loadSample('quakers') },
                            { label: 'EuroSiS', action: () => loadSample('eurosis') },
                            { label: 'Diseasome', action: () => loadSample('diseasome') },
                            { label: 'C. Elegans', action: () => loadSample('celegans') },
                            { label: 'Java Dependencies', action: () => loadSample('java') },
                            { label: 'Power Grid', action: () => loadSample('powergrid') }
                        ]
                    },
                    {
                        label: i18next.t('btnLoadProject'),
                        action: handleLoad,
                        align: 'right'
                    },
                    {
                        label: i18next.t('btnSaveProject'),
                        action: handleSave,
                        align: 'right'
                    },
                    {
                        label: i18next.t('btnExport'),
                        action: downloadSVG,
                        align: 'right'
                    }
                ]
            });
            console.log('setConfig called.');
        } else {
            console.error('dataviz-tool-header element not found in DOM.');
        }
    });

});

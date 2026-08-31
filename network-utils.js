export const SOURCE_ALIASES = [
    'source', 'from', 'src', 'start', 'origin',
    '始点', '起点', '送信元', '送り手', 'ソース'
];

export const TARGET_ALIASES = [
    'target', 'to', 'dst', 'tgt', 'end', 'destination',
    '終点', '対象', '宛先', '受け手', 'ターゲット'
];

export const WEIGHT_ALIASES = [
    'weight', 'value', 'strength', 'count', 'score', 'width',
    '重み', 'ウェイト', '値', '回数', '強度', '太さ'
];

export function detectDelimiter(text) {
    const first = String(text || '').split(/\r?\n/).find((line) => ltrim(line));
    if (!first) return ',';
    let inQuotes = false;
    let commas = 0;
    let tabs = 0;
    for (let i = 0; i < first.length; i++) {
        const ch = first[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (!inQuotes && ch === ',') {
            commas += 1;
        } else if (!inQuotes && ch === '\t') {
            tabs += 1;
        }
    }
    return tabs > commas ? '\t' : ',';
}

function ltrim(value) {
    return String(value || '').trim();
}

export function parseTable(text, delimiter) {
    if (text == null) return [];
    text = String(text);
    if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
    }
    const sep = delimiter || detectDelimiter(text);
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
                    i += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === sep) {
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
    row.push(current.trim());
    if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
        rows.push(row);
    }
    return rows;
}

export function parseCSV(text) {
    return parseTable(text);
}

function normalizeHeader(header) {
    return String(header || '').trim().toLowerCase();
}

export function guessColumnIndex(headers, aliases) {
    const lower = headers.map(normalizeHeader);
    const aliasList = aliases.map(normalizeHeader);
    for (const alias of aliasList) {
        const idx = lower.indexOf(alias);
        if (idx >= 0) return idx;
    }
    for (let i = 0; i < lower.length; i++) {
        for (const alias of aliasList) {
            if (lower[i] && (lower[i].includes(alias) || alias.includes(lower[i]))) {
                return i;
            }
        }
    }
    return -1;
}

export function guessMapping(headers) {
    return {
        sourceIdx: guessColumnIndex(headers, SOURCE_ALIASES),
        targetIdx: guessColumnIndex(headers, TARGET_ALIASES),
        weightIdx: guessColumnIndex(headers, WEIGHT_ALIASES)
    };
}

export function coerceValue(val) {
    if (val === undefined || val === null) return undefined;
    const text = String(val).trim();
    if (text === '') return undefined;
    const num = Number(text);
    return Number.isNaN(num) ? val : num;
}

export function coerceNumber(val, fallback) {
    const num = Number(val);
    return Number.isNaN(num) ? fallback : num;
}

export function edgeKey(source, target, directed) {
    if (directed) return source + '\0' + target;
    return source < target ? source + '\0' + target : target + '\0' + source;
}

function mergeNumeric(existing, incoming) {
    const out = { ...existing };
    Object.keys(incoming).forEach((key) => {
        const next = incoming[key];
        if (next === undefined) return;
        if (typeof next === 'number' && typeof out[key] === 'number') {
            out[key] += next;
        } else if (out[key] === undefined) {
            out[key] = next;
        }
    });
    return out;
}

export function buildGraphFromEdgeRows(rows, options) {
    const headers = options.headers || (rows[0] || []);
    const sourceIdx = options.sourceIdx;
    const targetIdx = options.targetIdx;
    const weightIdx = options.weightIdx;
    const directed = Boolean(options.directed);
    const aggregate = options.aggregate !== false;
    const dataRows = options.hasHeader === false ? rows : rows.slice(1);

    if (sourceIdx < 0 || targetIdx < 0) {
        throw new Error('source_target_required');
    }

    const extraIndices = headers
        .map((_, i) => i)
        .filter((i) => i !== sourceIdx && i !== targetIdx);

    const nodeSet = new Set();
    const edgeMap = new Map();
    const edges = [];
    let skipped = 0;
    let duplicates = 0;

    dataRows.forEach((row, index) => {
        const source = ltrim(row[sourceIdx]);
        const target = ltrim(row[targetIdx]);
        if (!source || !target) {
            skipped += 1;
            return;
        }
        nodeSet.add(source);
        nodeSet.add(target);

        const attrs = {};
        extraIndices.forEach((colIdx) => {
            const value = coerceValue(row[colIdx]);
            if (value !== undefined) {
                attrs[headers[colIdx]] = value;
            }
        });

        const weight = weightIdx >= 0
            ? coerceNumber(row[weightIdx], 1)
            : (typeof attrs.weight === 'number' ? attrs.weight : 1);
        attrs.weight = weight;

        if (aggregate) {
            const key = edgeKey(source, target, directed);
            const existing = edgeMap.get(key);
            if (existing) {
                duplicates += 1;
                existing.attrs = mergeNumeric(existing.attrs, attrs);
                existing.count += 1;
            } else {
                edgeMap.set(key, {
                    source,
                    target,
                    attrs,
                    count: 1
                });
            }
        } else {
            edges.push({
                group: 'edges',
                data: {
                    id: 'e' + (index + 1),
                    source,
                    target,
                    ...attrs
                }
            });
        }
    });

    if (aggregate) {
        let i = 1;
        edgeMap.forEach((edge) => {
            edges.push({
                group: 'edges',
                data: {
                    id: 'e' + i,
                    source: edge.source,
                    target: edge.target,
                    count: edge.count,
                    ...edge.attrs
                }
            });
            i += 1;
        });
    }

    const nodes = [...nodeSet].map((id) => ({
        group: 'nodes',
        data: { id, label: id }
    }));

    return {
        nodes,
        edges,
        directed,
        skipped,
        duplicates,
        nodeCount: nodes.length,
        edgeCount: edges.length
    };
}

export function inferScaleType(values) {
    const present = values.filter((v) => v !== undefined && v !== null && String(v).trim() !== '');
    if (present.length === 0) return 'categorical';
    const numeric = present.filter((v) => !Number.isNaN(Number(v)));
    const unique = new Set(present.map((v) => String(v)));
    if (numeric.length === present.length && unique.size > 8) return 'sequential';
    if (numeric.length === present.length && unique.size > Math.max(8, present.length * 0.4)) {
        return 'sequential';
    }
    return 'categorical';
}

export function numericExtent(values) {
    let min = Infinity;
    let max = -Infinity;
    values.forEach((v) => {
        const n = Number(v);
        if (!Number.isNaN(n)) {
            if (n < min) min = n;
            if (n > max) max = n;
        }
    });
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return { min: 0, max: 0 };
    }
    return { min, max };
}

export function scaleLinear(value, min, max, outMin, outMax) {
    if (max === min) return (outMin + outMax) / 2;
    return outMin + ((value - min) / (max - min)) * (outMax - outMin);
}

export const CATEGORICAL_PALETTES = {
    category10: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    tableau10: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9d9a', '#9c755f', '#bab0ac'],
    set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    okabe: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000']
};

export const SEQUENTIAL_PALETTES = {
    blues: 'interpolateBlues',
    oranges: 'interpolateOranges',
    greens: 'interpolateGreens',
    viridis: 'interpolateViridis',
    plasma: 'interpolatePlasma'
};

export function pickCategoryColor(value, map, palette) {
    const key = String(value);
    if (!map.has(key)) {
        map.set(key, palette[map.size % palette.length]);
    }
    return map.get(key);
}

export function sequentialColor(interpolator, value, min, max) {
    if (typeof interpolator !== 'function') return '#9ecae1';
    if (max === min) return interpolator(0.55);
    const t = 0.2 + ((value - min) / (max - min)) * 0.8;
    return interpolator(Math.max(0, Math.min(1, t)));
}

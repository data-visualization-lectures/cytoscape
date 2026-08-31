import {
    parseTable,
    detectDelimiter,
    guessMapping,
    buildGraphFromEdgeRows,
    inferScaleType,
    edgeKey
} from './network-utils.js';

function assert(cond, message) {
    if (!cond) throw new Error(message);
}

const csv = 'Source,Target,Weight\nA,B,2\nA,B,3\nB,C,1\n';
const rows = parseTable(csv);
assert(rows[0][0] === 'Source', 'header');
assert(detectDelimiter('a\tb\n1\t2') === '\t', 'tab delimiter');

const ja = parseTable('始点,終点,重み\n南平台,支店長,5\n');
const guessed = guessMapping(ja[0]);
assert(guessed.sourceIdx === 0, 'ja source');
assert(guessed.targetIdx === 1, 'ja target');
assert(guessed.weightIdx === 2, 'ja weight');

const aggregated = buildGraphFromEdgeRows(rows, {
    headers: rows[0],
    sourceIdx: 0,
    targetIdx: 1,
    weightIdx: 2,
    directed: false,
    aggregate: true
});
assert(aggregated.edgeCount === 2, 'aggregated edges');
assert(aggregated.duplicates === 1, 'duplicate counted');
const ab = aggregated.edges.find((e) =>
    (e.data.source === 'A' && e.data.target === 'B') ||
    (e.data.source === 'B' && e.data.target === 'A')
);
assert(ab && ab.data.weight === 5, 'weights summed');

const directed = buildGraphFromEdgeRows(rows, {
    headers: rows[0],
    sourceIdx: 0,
    targetIdx: 1,
    weightIdx: 2,
    directed: true,
    aggregate: false
});
assert(directed.edgeCount === 3, 'unaggregated directed');
assert(edgeKey('B', 'A', false) === edgeKey('A', 'B', false), 'undirected key');
assert(edgeKey('B', 'A', true) !== edgeKey('A', 'B', true), 'directed key');

assert(inferScaleType([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === 'sequential', 'numeric sequential');
assert(inferScaleType(['a', 'b', 'a', 'c']) === 'categorical', 'categorical');

const bom = parseTable('\uFEFFsource,target\n1,2\n');
assert(bom[0][0] === 'source', 'bom stripped');

console.log('network-utils tests passed');

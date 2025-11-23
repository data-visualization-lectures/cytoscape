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

    // Helper to generate color from string
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    }

    // Style update function
    function updateNodeStyle() {
        const colorAttr = colorSelect.value;
        const sizeAttr = sizeSelect.value;

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

            // Apply color
            if (colorAttr && data[colorAttr] !== undefined) {
                const val = data[colorAttr];
                const color = stringToColor(String(val));
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

    // Bind events
    colorSelect.onchange = updateNodeStyle;
    sizeSelect.onchange = updateNodeStyle;

    function extractAndPopulateAttributes() {
        const nodeAttributes = new Set();
        cy.nodes().forEach(node => {
            const attributes = node.data();
            Object.keys(attributes).forEach(key => {
                if (key !== 'id' && key !== 'label' && key !== 'x' && key !== 'y') {
                    nodeAttributes.add(key);
                }
            });
        });

        // Clear existing options except the first one
        while (colorSelect.options.length > 1) colorSelect.remove(1);
        while (sizeSelect.options.length > 1) sizeSelect.remove(1);

        nodeAttributes.forEach(attr => {
            const option1 = document.createElement('option');
            option1.value = attr;
            option1.text = attr;
            colorSelect.add(option1);

            const option2 = document.createElement('option');
            option2.value = attr;
            option2.text = attr;
            sizeSelect.add(option2);
        });
    }

    // Initialize with default data
    extractAndPopulateAttributes();
    updateNodeStyle();


    const downloadBtn = document.getElementById('download-svg');
    downloadBtn.addEventListener('click', function () {
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
    });

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

    const sampleDatasetSelect = document.getElementById('sample-dataset-select');
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

                // Apply layout
                const layoutName = document.getElementById('layout-select').value;
                const easingName = document.getElementById('easing-select').value;
                cy.layout({ name: layoutName, animate: true, animationEasing: easingName }).run();

                // Re-enable dropdown
                sampleDatasetSelect.disabled = false;

            } catch (error) {
                console.error(`Error parsing ${datasetKey} dataset:`, error);
                alert(`Failed to parse ${datasetKey} dataset. Please try another one.`);
                sampleDatasetSelect.value = '';
                sampleDatasetSelect.disabled = false;
            }

        } catch (error) {
            console.error(`Error loading ${datasetKey} dataset:`, error);
            alert(`Failed to load ${datasetKey} dataset. Please check your internet connection.`);
            this.value = '';
            this.disabled = false;
        }
    });

    // Auto-load the default dataset (Les Misérables) on page load
    window.addEventListener('load', function () {
        // Trigger the change event to load the default selected dataset
        sampleDatasetSelect.dispatchEvent(new Event('change'));
    });

    const fileUpload = document.getElementById('file-upload');
    fileUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            try {
                let graph;
                if (file.name.endsWith('.gexf')) {
                    // Parse GEXF using graphology
                    graph = graphology.Graph.from(graphologyLibrary.gexf.parse(graphology.MultiGraph, content));
                } else if (file.name.endsWith('.graphml')) {
                    // Parse GraphML using graphology
                    graph = graphology.Graph.from(graphologyLibrary.graphml.parse(graphology.MultiGraph, content));
                } else {
                    alert('Unsupported file format. Please upload .gexf or .graphml files.');
                    return;
                }


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
                        // Set default style initially
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

                // Apply layout if positions are not defined or to reset view
                const layoutName = document.getElementById('layout-select').value;
                const easingName = document.getElementById('easing-select').value;
                cy.layout({ name: layoutName, animate: true, animationEasing: easingName }).run();

            } catch (error) {
                console.error('Error parsing file:', error);
                alert('Failed to parse file. Please check the console for details.');
            }
        };
        reader.readAsText(file);
    });
});

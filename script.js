document.addEventListener('DOMContentLoaded', function () {
    const cy = cytoscape({
        container: document.getElementById('cy'),

        elements: [
            // Nodes
            { data: { id: 'a', label: 'Node A', type: 'core' } },
            { data: { id: 'b', label: 'Node B', type: 'core' } },
            { data: { id: 'c', label: 'Node C', type: 'leaf' } },
            { data: { id: 'd', label: 'Node D', type: 'leaf' } },
            { data: { id: 'e', label: 'Node E', type: 'leaf' } },
            { data: { id: 'f', label: 'Node F', type: 'leaf' } },
            { data: { id: 'g', label: 'Node G', type: 'leaf' } },

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
                    'background-color': '#007bff',
                    'label': 'data(label)',
                    'color': '#333',
                    'font-size': '12px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'width': '40px',
                    'height': '40px',
                    'text-outline-width': 2,
                    'text-outline-color': '#fff'
                }
            },
            {
                selector: 'node[type="core"]',
                style: {
                    'background-color': '#ff5722',
                    'width': '60px',
                    'height': '60px',
                    'font-size': '14px'
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
                graph.forEachNode((node, attributes) => {
                    elements.push({
                        group: 'nodes',
                        data: {
                            id: node,
                            label: attributes.label || node,
                            ...attributes
                        },
                        position: {
                            x: attributes.x || Math.random() * 800,
                            y: attributes.y || Math.random() * 600
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

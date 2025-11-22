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

    layoutSelect.addEventListener('change', function () {
        const layoutName = this.value;
        const layout = cy.layout({
            name: layoutName,
            animate: true,
            animationDuration: 500
        });
        layout.run();
    });

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
});

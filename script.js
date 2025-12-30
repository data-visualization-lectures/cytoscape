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
    labelSelect.onchange = updateNodeStyle;

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

        // Store current selections to restore if possible
        const currentColor = colorSelect.value;
        const currentSize = sizeSelect.value;
        const currentLabel = labelSelect.value;

        // Clear existing options except the first one
        while (colorSelect.options.length > 1) colorSelect.remove(1);
        while (sizeSelect.options.length > 1) sizeSelect.remove(1);
        while (labelSelect.options.length > 1) labelSelect.remove(1);

        nodeAttributes.forEach(attr => {
            const option1 = document.createElement('option');
            option1.value = attr;
            option1.text = attr;
            colorSelect.add(option1);

            const option2 = document.createElement('option');
            option2.value = attr;
            option2.text = attr;
            sizeSelect.add(option2);

            const option3 = document.createElement('option');
            option3.value = attr;
            option3.text = attr;
            labelSelect.add(option3);
        });

        // Restore selections if attributes still exist, otherwise reset
        if (nodeAttributes.has(currentColor)) colorSelect.value = currentColor;
        if (nodeAttributes.has(currentSize)) sizeSelect.value = currentSize;
        if (nodeAttributes.has(currentLabel)) labelSelect.value = currentLabel;
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

            // Apply layout
            const layoutName = layoutSelect.value;
            const easingName = easingSelect.value;
            cy.layout({ name: layoutName, animate: true, animationEasing: easingName }).run();

        } catch (error) {
            console.error('Error parsing graph data:', error);
            alert('Failed to parse graph data. Please check the file format and console for details.');
            throw error; // Re-throw to handle specific UI resets in caller
        }
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
                alert(`Failed to load ${datasetKey} dataset. Please check your internet connection.`);
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
                let isGraphML = false;
                if (file.name.endsWith('.gexf')) {
                    isGraphML = false;
                } else if (file.name.endsWith('.graphml')) {
                    isGraphML = true;
                } else {
                    alert('Unsupported file format. Please upload .gexf or .graphml files.');
                    return;
                }

                loadGraphData(content, isGraphML);

                // Clear the input so the same file can be selected again if needed
                fileUpload.value = '';

            } catch (error) {
                console.error('Error processing uploaded file:', error);
                // Alert already handled in loadGraphData
            }
        };
        reader.readAsText(file);
    });

    // Control panel toggle
    const toggleBtn = document.getElementById('toggle-controls-btn');
    const controlsPanel = document.getElementById('controls');

    // Check if elements exist before adding listeners to avoid errors
    if (toggleBtn && controlsPanel) {
        toggleBtn.addEventListener('click', function () {
            controlsPanel.classList.toggle('collapsed');
        });
    }

    // ==========================================
    // Server Storage Implementation (Supabase)
    // ==========================================

    // Configuration (Must match dataviz-auth-client.js)
    const SUPABASE_URL = "https://vebhoeiltxspsurqoxvl.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYmhvZWlsdHhzcHN1cnFveHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMjI2MTIsImV4cCI6MjA0NTc5ODYxMn0.sV-Xf6wP_m46D_q-XN0oZfK9NogDqD9xV5sS-n6J8c4";
    const API_BASE_URL = "https://api.dataviz.jp";
    const AUTH_COOKIE_NAME = "sb-dataviz-auth-token";
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

    // Cookie Helper (Shared Logic)
    const COOKIE_DOMAIN = (() => {
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
            return null;
        }
        return ".dataviz.jp";
    })();

    const cookieStorage = {
        getItem: (key) => {
            const cookies = document.cookie.split(";").map((c) => c.trim()).filter(Boolean);
            for (const c of cookies) {
                const [k, ...rest] = c.split("=");
                if (k === key) {
                    const rawVal = decodeURIComponent(rest.join("="));
                    try { return JSON.parse(rawVal); } catch (e) { }
                    try {
                        let toDecode = rawVal.startsWith('base64-') ? rawVal.slice(7) : rawVal;
                        const base64Standard = toDecode.replace(/-/g, '+').replace(/_/g, '/');
                        return JSON.parse(atob(base64Standard));
                    } catch (e) { return null; }
                }
            }
            return null;
        },
        setItem: (key, value) => {
            let encoded;
            try { encoded = btoa(value); } catch (e) { return; }
            let cookieStr = `${key}=${encoded}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=None; Secure`;
            if (COOKIE_DOMAIN) cookieStr += `; Domain=${COOKIE_DOMAIN}`;
            document.cookie = cookieStr;
        },
        removeItem: (key) => {
            let cookieStr = `${key}=; Max-Age=0; Path=/; SameSite=None; Secure`;
            if (COOKIE_DOMAIN) cookieStr += `; Domain=${COOKIE_DOMAIN}`;
            document.cookie = cookieStr;
        },
    };

    // Initialize Supabase Client
    let supabaseClient = null;
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                storage: cookieStorage,
                storageKey: AUTH_COOKIE_NAME,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    } else {
        console.error("Supabase library not found!");
    }

    // API Functions
    async function getAuthHeaders() {
        if (!supabaseClient) throw new Error("Supabase client not initialized");
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        return {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        };
    }

    const API = {
        async fetchProjects() {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/api/projects?app=cytoscape`, { headers });
            if (!response.ok) throw new Error("Failed to fetch projects");
            return await response.json();
        },

        async saveProject(name, data, thumbnailBase64, id = null) {
            const headers = await getAuthHeaders();
            const payload = {
                name: name,
                app_name: 'cytoscape',
                data: data,
                thumbnail: thumbnailBase64
            };

            let url = `${API_BASE_URL}/api/projects`;
            let method = 'POST';

            if (id) {
                url = `${API_BASE_URL}/api/projects/${id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to save project");
            return await response.json();
        },

        async loadProject(id) {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, { headers });
            if (!response.ok) throw new Error("Failed to load project data");
            return await response.json();
        },

        async deleteProject(id) {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            if (!response.ok) throw new Error("Failed to delete project");
            return await response.json();
        }
    };

    // UI & Logic
    const serverSaveBtn = document.getElementById('server-save-btn');
    const serverLoadBtn = document.getElementById('server-load-btn');
    const saveModal = document.getElementById('save-modal');
    const loadModal = document.getElementById('load-modal');
    const confirmSaveBtn = document.getElementById('confirm-save-btn');
    const cancelSaveBtn = document.getElementById('cancel-save-btn');
    const cancelLoadBtn = document.getElementById('cancel-load-btn');
    const saveProjectNameInput = document.getElementById('save-project-name');
    const projectListContainer = document.getElementById('project-list');

    let currentProjectId = null; // Track currently loaded project ID for updates

    // --- Save Flow ---
    if (serverSaveBtn) {
        serverSaveBtn.addEventListener('click', async () => {
            // Check auth first
            try {
                await getAuthHeaders();
                saveModal.classList.remove('hidden');
                // Pre-fill name if we have one (could be implemented if we stored name)
            } catch (e) {
                alert("Please log in to save projects.");
            }
        });
    }

    if (cancelSaveBtn) {
        cancelSaveBtn.addEventListener('click', () => {
            saveModal.classList.add('hidden');
        });
    }

    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', async () => {
            const name = saveProjectNameInput.value.trim();
            if (!name) {
                alert("Please enter a project name.");
                return;
            }

            confirmSaveBtn.textContent = "Saving...";
            confirmSaveBtn.disabled = true;

            try {
                // 1. Generate Thumbnail
                const pngContent = cy.png({ output: 'base64uri', full: true, scale: 0.5, maxWidth: 600 });

                // 2. Serialize Data
                const data = cy.json();

                // 3. Save API Call
                const result = await API.saveProject(name, data, pngContent, currentProjectId);

                // 4. Update state
                if (result.project && result.project.id) {
                    currentProjectId = result.project.id;
                }

                alert("Project saved successfully!");
                saveModal.classList.add('hidden');

            } catch (error) {
                console.error("Save error:", error);
                alert("Failed to save project. " + error.message);
            } finally {
                confirmSaveBtn.textContent = "Save";
                confirmSaveBtn.disabled = false;
            }
        });
    }

    // --- Load Flow ---
    if (serverLoadBtn) {
        serverLoadBtn.addEventListener('click', async () => {
            try {
                // Check auth
                await getAuthHeaders();
                loadModal.classList.remove('hidden');
                refreshProjectList();
            } catch (e) {
                alert("Please log in to load projects.");
            }
        });
    }

    if (cancelLoadBtn) {
        cancelLoadBtn.addEventListener('click', () => {
            loadModal.classList.add('hidden');
        });
    }

    async function refreshProjectList() {
        projectListContainer.innerHTML = '<div style="text-align:center; padding:20px;">Loading projects...</div>';

        try {
            const data = await API.fetchProjects();
            const projects = data.projects || [];

            projectListContainer.innerHTML = '';

            if (projects.length === 0) {
                projectListContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">No saved projects found.</div>';
                return;
            }

            projects.forEach(p => {
                const item = document.createElement('div');
                item.className = 'project-item';

                // Initial creation date formatting
                const dateStr = new Date(p.updated_at || p.created_at).toLocaleString();

                // Thumbnail handling
                let imgHtml = '';
                if (p.thumbnail_path) {
                    const thumbUrl = `${API_BASE_URL}/api/projects/${p.id}/thumbnail`;
                    item.dataset.thumbUrl = thumbUrl;
                    imgHtml = `<div class="project-thumbnail" style="display:flex;align-items:center;justify-content:center;font-size:10px;color:#888;">Checking...</div>`;
                } else {
                    imgHtml = `<div class="project-thumbnail" style="background:#eee;"></div>`;
                }

                item.innerHTML = `
                    ${imgHtml}
                    <div class="project-info">
                        <span class="project-name">${p.name}</span>
                        <span class="project-date">${dateStr}</span>
                    </div>
                    <button class="delete-project-btn" title="Delete">×</button>
                `;

                // Load Action
                item.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('delete-project-btn')) return; // Ignore delete click

                    loadModal.classList.add('hidden');
                    try {
                        await loadProjectToGraph(p.id);
                        currentProjectId = p.id;
                        saveProjectNameInput.value = p.name; // Update name input for subsequent saves
                    } catch (err) {
                        console.error(err);
                        alert("Failed to load project.");
                    }
                });

                // Delete Action
                const delBtn = item.querySelector('.delete-project-btn');
                delBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                        try {
                            await API.deleteProject(p.id);
                            item.remove();
                            if (currentProjectId === p.id) currentProjectId = null;
                        } catch (err) {
                            alert("Failed to delete project.");
                        }
                    }
                });

                projectListContainer.appendChild(item);

                // Lazy load thumbnail
                if (p.thumbnail_path) {
                    loadThumbnailBlob(p.id, item.querySelector('.project-thumbnail'));
                }
            });

        } catch (error) {
            console.error("List refresh error:", error);
            projectListContainer.innerHTML = '<div style="text-align:center; padding:20px; color:red;">Failed to load project list.</div>';
        }
    }

    async function loadThumbnailBlob(projectId, imgContainer) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/thumbnail`, { headers });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                imgContainer.innerHTML = '';
                imgContainer.style.backgroundImage = `url(${url})`;
                imgContainer.style.backgroundSize = 'cover';
                imgContainer.style.backgroundPosition = 'center';
            } else {
                imgContainer.textContent = 'No Img';
            }
        } catch (e) {
            imgContainer.textContent = 'Err';
        }
    }

    async function loadProjectToGraph(id) {
        // Show loading indicator
        const originalText = serverLoadBtn ? serverLoadBtn.textContent : '';
        if (serverLoadBtn) serverLoadBtn.textContent = "Loading...";

        try {
            const data = await API.loadProject(id);
            if (data) {
                cy.json(data);
                extractAndPopulateAttributes();
                alert("Project loaded!");
            }

        } catch (e) {
            throw e;
        } finally {
            if (serverLoadBtn) serverLoadBtn.textContent = originalText || "Load from Server";
        }
    }

    // --- URL Parameter Auto-Load ---
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = urlParams.get('project_id');
    if (urlProjectId) {
        setTimeout(async () => {
            try {
                await loadProjectToGraph(urlProjectId);
                currentProjectId = urlProjectId;
            } catch (e) {
                console.log("Auto-load failed (likely auth or invalid ID):", e);
            }
        }, 1000);
    }

});

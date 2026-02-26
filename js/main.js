import * as UI from './ui.js';
import * as Hotspots from './hotspots.js';
import * as ContentManager from './contentManager.js';
import * as Export from './export.js';
import { MESSAGES } from './utils/constants.js';
import { validateContent, validateImageFile } from './utils/validators.js';
import { saveProject, loadProject, clearAllStorage } from './utils/storage.js';
import HistoryManager from './modules/history.js';
import SearchManager from './modules/search.js';
import HotspotEditor from './modules/hotspotEditor.js';
import ContentTypeManager from './modules/contentTypes.js';

const history = new HistoryManager();
const searchManager = new SearchManager();
const editor = new HotspotEditor();
const contentTypeManager = new ContentTypeManager();

function main() {
    lucide.createIcons();
    const savedProject = loadProject();
    if (savedProject) loadSavedProject(savedProject);
    UI.init();
    Hotspots.init(document.getElementById('editor-canvas'), UI.onHotspotSelect, UI.onHotspotDeselect);
    setupEventListeners();
    setupKeyboardShortcuts();
    console.log('✨ FASE 2 Completa');
}

function loadSavedProject(project) {
    const img = new Image();
    img.onload = () => {
        Hotspots.loadImage(img);
        UI.showEditingControls();
        if (project.hotspots?.length) project.hotspots.forEach(h => Hotspots.addHotspot(h));
        searchManager.setHotspots(Hotspots.getAll());
    };
    img.src = project.image;
}

function setupEventListeners() {
    const imageUpload = document.getElementById('image-upload');
    const drawModeBtn = document.getElementById('draw-mode-btn');
    const selectModeBtn = document.getElementById('select-mode-btn');
    const clearProjectBtn = document.getElementById('clear-project-btn');
    const editContentBtn = document.getElementById('edit-content-btn');
    const deleteHotspotBtn = document.getElementById('delete-hotspot-btn');
    const saveContentBtn = document.getElementById('save-content-btn');
    const previewBtn = document.getElementById('preview-btn');
    const exportBtn = document.getElementById('export-btn');

    imageUpload.addEventListener('change', handleImageUpload);
    drawModeBtn.addEventListener('click', () => { Hotspots.setMode('draw'); showNotification('Modo: Dibujar'); });
    selectModeBtn.addEventListener('click', () => { Hotspots.setMode('select'); showNotification('Modo: Seleccionar'); });
    clearProjectBtn.addEventListener('click', handleClearProject);
    editContentBtn.addEventListener('click', () => { const s = Hotspots.getSelected(); if (s) UI.showContentModal(s); });
    deleteHotspotBtn.addEventListener('click', () => { if (confirm('¿Eliminar?')) { history.push(Hotspots.getAll()); Hotspots.deleteSelected(); autoSaveProject(); showNotification('🗑️'); } });
    saveContentBtn.addEventListener('click', () => { const cd = UI.getContentFromModal(); const v = validateContent(cd.type, cd); if (!v.valid) { alert(v.error); return; } ContentManager.saveContent(UI.getCurrentEditingHotspotId(), cd); history.push(Hotspots.getAll()); UI.hideContentModal(); autoSaveProject(); showNotification('✅'); });
    previewBtn.addEventListener('click', Export.preview);
    exportBtn.addEventListener('click', () => { autoSaveProject(); Export.exportToFile(); showNotification('📥'); });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); autoSaveProject(); showNotification('💾'); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); const p = history.undo(); if (p) { Hotspots.setAll(p); showNotification('↶'); } }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); const n = history.redo(); if (n) { Hotspots.setAll(n); showNotification('↷'); } }
        if (e.key === 'Delete') { const s = Hotspots.getSelected(); if (s) { e.preventDefault(); history.push(Hotspots.getAll()); Hotspots.deleteSelected(); autoSaveProject(); showNotification('🗑️'); } }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') { const s = Hotspots.getSelected(); if (s) { e.preventDefault(); const d = editor.duplicate(s, Hotspots.getAll()); if (d) { history.push(Hotspots.getAll()); autoSaveProject(); showNotification('📋'); } } }
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    const v = validateImageFile(file);
    if (!v.valid) { alert(v.error); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => { Hotspots.loadImage(img); UI.showEditingControls(); history.clear(); history.push(Hotspots.getAll()); searchManager.setHotspots(Hotspots.getAll()); autoSaveProject(); showNotification('✅'); };
        img.onerror = () => showNotification('❌');
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handleClearProject() {
    if (confirm('¿Borrar todo?')) { clearAllStorage(); history.clear(); searchManager.clear(); window.location.reload(); }
}

function autoSaveProject() {
    try {
        const canvas = document.getElementById('editor-canvas');
        const image = canvas.toDataURL?.() || null;
        const hotspots = Hotspots.getAll();
        if (image && hotspots) { saveProject(image, hotspots); searchManager.setHotspots(hotspots); }
    } catch (e) { console.warn('Error:', e); }
}

function showNotification(msg) {
    let n = document.getElementById('notification');
    if (!n) { n = document.createElement('div'); n.id = 'notification'; n.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:16px;border-radius:8px;z-index:1000;'; document.body.appendChild(n); }
    n.textContent = msg;
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', main);

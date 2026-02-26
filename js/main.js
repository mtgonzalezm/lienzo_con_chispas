import * as UI from './ui.js';
import * as Hotspots from './hotspots.js';
import * as ContentManager from './contentManager.js';
import * as Export from './export.js';
import { MESSAGES } from './utils/constants.js';
import { validateContent, validateImageFile } from './utils/validators.js';
import { saveProject, loadProject, clearAllStorage } from './utils/storage.js';
import HistoryManager from './modules/history.js';

const history = new HistoryManager();

function main() {
    lucide.createIcons();
    const savedProject = loadProject();
    if (savedProject) loadSavedProject(savedProject);
    UI.init();
    Hotspots.init(document.getElementById('editor-canvas'), UI.onHotspotSelect, UI.onHotspotDeselect);
    setupEventListeners();
    setupKeyboardShortcuts();
    console.log('✨ Imagen Explora v2.0 - Refactorizada');
}

function loadSavedProject(project) {
    try {
        const img = new Image();
        img.onload = () => {
            Hotspots.loadImage(img);
            UI.showEditingControls();
            if (project.hotspots && project.hotspots.length > 0) {
                project.hotspots.forEach(h => Hotspots.addHotspot(h));
            }
        };
        img.src = project.image;
    } catch (e) {
        console.error('Error cargando:', e);
    }
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
    drawModeBtn.addEventListener('click', () => {
        Hotspots.setMode('draw');
        showNotification('Modo: Dibujar zona');
    });
    selectModeBtn.addEventListener('click', () => {
        Hotspots.setMode('select');
        showNotification('Modo: Seleccionar zona');
    });
    clearProjectBtn.addEventListener('click', handleClearProject);

    editContentBtn.addEventListener('click', () => {
        const selected = Hotspots.getSelected();
        if (selected) UI.showContentModal(selected);
    });

    deleteHotspotBtn.addEventListener('click', () => {
        if (confirm('¿Eliminar esta zona?')) {
            history.push(Hotspots.getAll());
            Hotspots.deleteSelected();
            autoSaveProject();
            showNotification('🗑️ Zona eliminada');
        }
    });
    
    saveContentBtn.addEventListener('click', () => {
        const contentData = UI.getContentFromModal();
        const validation = validateContent(contentData.type, contentData);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }
        ContentManager.saveContent(UI.getCurrentEditingHotspotId(), contentData);
        history.push(Hotspots.getAll());
        UI.hideContentModal();
        autoSaveProject();
        showNotification('✅ Contenido guardado');
    });

    previewBtn.addEventListener('click', Export.preview);
    exportBtn.addEventListener('click', () => {
        autoSaveProject();
        Export.exportToFile();
        showNotification('📥 Proyecto exportado');
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            autoSaveProject();
            showNotification('💾 Guardado');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            const prev = history.undo();
            if (prev) {
                Hotspots.setAll(prev);
                showNotification('↶ Deshecho');
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            const next = history.redo();
            if (next) {
                Hotspots.setAll(next);
                showNotification('↷ Rehecho');
            }
        }
        if (e.key === 'Delete') {
            const selected = Hotspots.getSelected();
            if (selected) {
                e.preventDefault();
                history.push(Hotspots.getAll());
                Hotspots.deleteSelected();
                autoSaveProject();
                showNotification('🗑️ Eliminado');
            }
        }
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
        alert(validation.error);
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            Hotspots.loadImage(img);
            UI.showEditingControls();
            history.clear();
            history.push(Hotspots.getAll());
            autoSaveProject();
            showNotification('✅ Imagen cargada');
        };
        img.onerror = () => showNotification('❌ Error cargando imagen');
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handleClearProject() {
    if (confirm('¿Borrar todo el proyecto?')) {
        clearAllStorage();
        history.clear();
        window.location.reload();
    }
}

function autoSaveProject() {
    try {
        const canvas = document.getElementById('editor-canvas');
        const image = canvas.toDataURL ? canvas.toDataURL() : null;
        const hotspots = Hotspots.getAll();
        if (image && hotspots) {
            saveProject(image, hotspots);
        }
    } catch (error) {
        console.warn('Error auto-guardando:', error);
    }
}

function showNotification(message) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background-color:#10b981;color:white;padding:16px 20px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:1000;';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', main);

cat > js/main.js << 'EOF'
import * as UI from './ui.js';
import * as Hotspots from './hotspots.js';
import * as ContentManager from './contentManager.js';
import * as Export from './export.js';

// ✨ NUEVOS IMPORTS - Módulos refactorizados
import { MESSAGES, STORAGE_KEYS } from './utils/constants.js';
import { validateContent, validateImageFile } from './utils/validators.js';
import { saveProject, loadProject, clearAllStorage, saveHotspots } from './utils/storage.js';
import HistoryManager from './modules/history.js';

// 🔄 Gestor de historial (para undo/redo)
const history = new HistoryManager();

/**
 * Función principal que se ejecuta cuando el DOM está completamente cargado.
 */
function main() {
    // Reemplaza los placeholders de iconos con los SVGs de Lucide
    lucide.createIcons();

    // Carga proyecto anterior si existe
    const savedProject = loadProject();
    if (savedProject) {
        loadSavedProject(savedProject);
    }

    // Inicializa los módulos
    UI.init();
    Hotspots.init(
        document.getElementById('editor-canvas'),
        UI.onHotspotSelect,
        UI.onHotspotDeselect
    );

    // Configura los listeners de eventos
    setupEventListeners();
    setupKeyboardShortcuts();
    
    console.log('✨ Imagen Explora App inicializada (v2.0 - Refactorizada)');
}

/**
 * Carga un proyecto guardado anteriormente
 */
function loadSavedProject(project) {
    try {
        const img = new Image();
        img.onload = () => {
            Hotspots.loadImage(img);
            UI.showEditingControls();
            // Restaurar hotspots
            if (project.hotspots && project.hotspots.length > 0) {
                project.hotspots.forEach(hotspot => {
                    Hotspots.addHotspot(hotspot);
                });
            }
        };
        img.src = project.image;
    } catch (error) {
        console.error('Error cargando proyecto:', error);
    }
}

/**
 * Configura todos los event listeners de la aplicación.
 */
function setupEventListeners() {
    // Referencias a los botones
    const imageUpload = document.getElementById('image-upload');
    const drawModeBtn = document.getElementById('draw-mode-btn');
    const selectModeBtn = document.getElementById('select-mode-btn');
    const clearProjectBtn = document.getElementById('clear-project-btn');
    const editContentBtn = document.getElementById('edit-content-btn');
    const deleteHotspotBtn = document.getElementById('delete-hotspot-btn');
    const saveContentBtn = document.getElementById('save-content-btn');
    const previewBtn = document.getElementById('preview-btn');
    const exportBtn = document.getElementById('export-btn');

    // Asignación de eventos
    imageUpload.addEventListener('change', handleImageUpload);
    drawModeBtn.addEventListener('click', () => {
        Hotspots.setMode('draw');
        showNotification('Modo dibujo: Haz clic y arrastra para crear una zona');
    });
    selectModeBtn.addEventListener('click', () => {
        Hotspots.setMode('select');
        showNotification('Modo seleccionar: Haz clic en una zona para editarla');
    });
    clearProjectBtn.addEventListener('click', handleClearProject);

    editContentBtn.addEventListener('click', () => {
        const selected = Hotspots.getSelected();
        if (selected) {
            UI.showContentModal(selected);
        }
    });

    deleteHotspotBtn.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres eliminar esta zona?')) {
            const hotspots = Hotspots.getAll();
            history.push(hotspots);
            Hotspots.deleteSelected();
            autoSaveProject();
            showNotification(MESSAGES.SUCCESS.hotspotDeleted);
        }
    });
    
    saveContentBtn.addEventListener('click', () => {
        const hotspotId = UI.getCurrentEditingHotspotId();
        const contentData = UI.getContentFromModal();
        
        // Validar contenido
        const validation = validateContent(contentData.type, contentData);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }
        
        ContentManager.saveContent(hotspotId, contentData);
        const hotspots = Hotspots.getAll();
        history.push(hotspots);
        UI.hideContentModal();
        autoSaveProject();
        showNotification(MESSAGES.SUCCESS.contentSaved);
    });

    // Conectar botones de vista previa y exportación
    previewBtn.addEventListener('click', Export.preview);
    exportBtn.addEventListener('click', () => {
        autoSaveProject();
        Export.exportToFile();
        showNotification(MESSAGES.SUCCESS.projectExported);
    });
}

/**
 * Configura los atajos de teclado
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+S o Cmd+S: Guardar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            autoSaveProject();
            showNotification('💾 Proyecto guardado automáticamente');
        }
        
        // Ctrl+Z o Cmd+Z: Deshacer
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            const previousState = history.undo();
            if (previousState) {
                // Restaurar estado anterior
                Hotspots.setAll(previousState);
                showNotification('↶ Acción deshecha');
            }
        }
        
        // Ctrl+Y o Cmd+Y: Rehacer
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            const nextState = history.redo();
            if (nextState) {
                // Restaurar estado siguiente
                Hotspots.setAll(nextState);
                showNotification('↷ Acción rehecha');
            }
        }
        
        // Supr: Eliminar hotspot seleccionado
        if (e.key === 'Delete') {
            const selected = Hotspots.getSelected();
            if (selected) {
                e.preventDefault();
                const hotspots = Hotspots.getAll();
                history.push(hotspots);
                Hotspots.deleteSelected();
                autoSaveProject();
                showNotification('🗑️ Zona eliminada');
            }
        }
    });
}

/**
 * Maneja la carga de la imagen seleccionada por el usuario.
 */
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    // Validar archivo
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
            const hotspots = Hotspots.getAll();
            history.push(hotspots);
            autoSaveProject();
            showNotification('✅ Imagen cargada correctamente');
        };
        img.onerror = () => {
            showNotification('❌ No se pudo cargar la imagen. Intenta con otro archivo.');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Maneja la limpieza completa del proyecto.
 */
function handleClearProject() {
    if (confirm('¿Estás seguro de que quieres borrar todo el proyecto? Esta acción no se puede deshacer.')) {
        clearAllStorage();
        history.clear();
        window.location.reload();
    }
}

/**
 * Guarda automáticamente el proyecto en localStorage
 */
function autoSaveProject() {
    try {
        const canvas = document.getElementById('editor-canvas');
        const image = canvas.toDataURL ? canvas.toDataURL() : null;
        const hotspots = Hotspots.getAll();
        
        if (image && hotspots) {
            saveProject(image, hotspots);
        }
    } catch (error) {
        console.warn('Error en auto-guardado:', error);
    }
}

/**
 * Muestra una notificación temporal al usuario
 */
function showNotification(message) {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', main);
EOF
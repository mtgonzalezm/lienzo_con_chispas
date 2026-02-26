// Referencias a los elementos de la UI
const placeholderText = document.getElementById('placeholder-text');
const canvas = document.getElementById('editor-canvas');
const editingControls = document.getElementById('editing-controls');
const hotspotDetails = document.getElementById('hotspot-details');
const hotspotIdDisplay = document.getElementById('hotspot-id');
const drawModeBtn = document.getElementById('draw-mode-btn');
const selectModeBtn = document.getElementById('select-mode-btn');
const previewBtn = document.getElementById('preview-btn');
const exportBtn = document.getElementById('export-btn');

// Referencias al Modal
const contentModal = document.getElementById('content-modal');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const saveContentBtn = document.getElementById('save-content-btn');

/**
 * Inicializa el estado de la UI y los listeners del modal.
 */
export function init() {
    cancelModalBtn.addEventListener('click', hideContentModal);
    
    saveContentBtn.addEventListener('click', () => {
        // La lógica para guardar el contenido irá aquí.
        // Por ahora, solo cerramos el modal.
        console.log("Guardando contenido...");
        hideContentModal();
    });
    console.log('UI Module Initialized');
}

/**
 * Muestra los controles de edición y oculta el texto de bienvenida.
 */
export function showEditingControls() {
    placeholderText.classList.add('hidden');
    canvas.classList.remove('hidden');
    editingControls.classList.remove('hidden');
    previewBtn.disabled = false;
    exportBtn.disabled = false;
}

/**
 * Actualiza la apariencia de los botones de modo (dibujo/selección).
 * @param {string} mode - El modo actual ('draw' o 'select').
 */
export function updateModeButtons(mode) {
    if (mode === 'draw') {
        drawModeBtn.classList.add('active-tool');
        selectModeBtn.classList.remove('active-tool');
    } else {
        selectModeBtn.classList.add('active-tool');
        drawModeBtn.classList.remove('active-tool');
    }
}

/**
 * Callback que se ejecuta cuando un hotspot es seleccionado en el canvas.
 * @param {object} hotspot - El objeto del hotspot seleccionado.
 */
export function onHotspotSelect(hotspot) {
    if (hotspot) {
        hotspotDetails.classList.remove('hidden');
        hotspotIdDisplay.textContent = `ID: hotspot-${hotspot.id}`;
    } else {
        onHotspotDeselect();
    }
}

/**
 * Callback que se ejecuta cuando se deselecciona un hotspot.
 */
export function onHotspotDeselect() {
    hotspotDetails.classList.add('hidden');
}

/**
 * Muestra el modal para editar el contenido de un hotspot.
 * @param {object} hotspot - El hotspot cuyo contenido se va a editar.
 */
export function showContentModal(hotspot) {
    console.log("Editando contenido para el hotspot:", hotspot.id);
    // Aquí poblaremos el formulario del modal con el contenido existente.
    contentModal.classList.remove('hidden');
    contentModal.classList.add('flex');
}

/**
 * Oculta el modal de edición de contenido.
 */
export function hideContentModal() {
    contentModal.classList.add('hidden');
    contentModal.classList.remove('flex');
}

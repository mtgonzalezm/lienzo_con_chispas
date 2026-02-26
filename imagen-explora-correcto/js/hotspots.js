import * as UI from './ui.js';

// --- Variables del Módulo ---
let canvas;
let ctx;
let image;
let hotspots = [];
let nextId = 1;
let currentMode = 'select';
let isDrawing = false;
let isDragging = false;
let selectedHotspot = null;
let dragStartX, dragStartY;
let startX, startY;

// --- Callbacks ---
let onSelectCallback;
let onDeselectCallback;

/**
 * Inicializa el módulo de hotspots.
 */
export function init(canvasElement, onSelect, onDeselect) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    onSelectCallback = onSelect;
    onDeselectCallback = onDeselect;
    setupCanvasListeners();
    setMode(currentMode);
}

/**
 * Carga una imagen en el canvas.
 */
export function loadImage(img) {
    image = img;
    canvas.width = image.width;
    canvas.height = image.height;
    redraw();
}

/**
 * Cambia el modo de edición.
 */
export function setMode(mode) {
    currentMode = mode;
    canvas.style.cursor = (mode === 'draw') ? 'crosshair' : 'default';
    UI.updateModeButtons(mode);
    if (mode === 'draw') {
        deselectAllHotspots();
    }
    redraw();
}

/**
 * Elimina el hotspot seleccionado actualmente.
 */
export function deleteSelected() {
    if (!selectedHotspot) return;
    const index = hotspots.findIndex(h => h.id === selectedHotspot.id);
    if (index > -1) {
        hotspots.splice(index, 1);
    }
    deselectAllHotspots();
}

/**
 * Devuelve el hotspot seleccionado.
 */
export function getSelected() {
    return selectedHotspot;
}

/**
 * Devuelve todos los datos del proyecto necesarios para exportar.
 * @returns {object} - Un objeto con la URL de la imagen y la lista de hotspots.
 */
export function getProjectData() {
    return {
        imageDataUrl: image ? image.src : null,
        hotspots: hotspots
    };
}

/**
 * Actualiza la propiedad de contenido de un hotspot específico.
 */
export function updateHotspotContent(id, content) {
    const hotspot = hotspots.find(h => h.id === id);
    if (hotspot) {
        hotspot.content = content;
        console.log("Hotspot actualizado:", hotspot);
        redraw(); // Redibuja para mostrar el indicador de contenido
    } else {
        console.error(`No se encontró el hotspot con ID: ${id}`);
    }
}

/**
 * Redibuja todo el canvas: imagen y hotspots.
 */
function redraw() {
    if (!image) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    hotspots.forEach(hotspot => {
        ctx.save();
        
        ctx.fillStyle = 'rgba(255, 204, 0, 0.5)';
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;

        if (hotspot === selectedHotspot) {
            ctx.fillStyle = 'rgba(29, 78, 216, 0.5)';
            ctx.strokeStyle = '#1D4ED8';
        }
        
        ctx.fillRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
        ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);

        // Añade un indicador visual 'i' si el hotspot tiene contenido
        if (hotspot.content) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const centerX = hotspot.x + hotspot.width / 2;
            const centerY = hotspot.y + hotspot.height / 2;
            ctx.fillText('i', centerX, centerY);
        }
        
        ctx.restore();
    });
}

/**
 * Configura los listeners del mouse sobre el canvas.
 */
function setupCanvasListeners() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);
}

// --- Manejadores de Eventos del Mouse ---

function handleMouseDown(e) {
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;

    if (currentMode === 'select') {
        const clickedHotspot = getHotspotAt(pos.x, pos.y);
        if (clickedHotspot) {
            if (selectedHotspot !== clickedHotspot) {
                selectedHotspot = clickedHotspot;
                onSelectCallback(selectedHotspot);
            }
            isDragging = true;
            dragStartX = pos.x - selectedHotspot.x;
            dragStartY = pos.y - selectedHotspot.y;
        } else {
            deselectAllHotspots();
        }
    } else if (currentMode === 'draw') {
        isDrawing = true;
        deselectAllHotspots();
    }
    redraw();
}

function handleMouseMove(e) {
    const pos = getMousePos(e);
    if (currentMode === 'select' && !isDragging) {
        canvas.style.cursor = getHotspotAt(pos.x, pos.y) ? 'move' : 'default';
    }
    if (isDrawing) {
        redraw();
        const width = pos.x - startX;
        const height = pos.y - startY;
        ctx.fillStyle = 'rgba(29, 78, 216, 0.5)';
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
    } else if (isDragging && selectedHotspot) {
        selectedHotspot.x = pos.x - dragStartX;
        selectedHotspot.y = pos.y - dragStartY;
        redraw();
    }
}

function handleMouseUp(e) {
    if (isDrawing) {
        isDrawing = false;
        const pos = getMousePos(e);
        const width = pos.x - startX;
        const height = pos.y - startY;
        if (Math.abs(width) > 10 && Math.abs(height) > 10) {
            const newHotspot = {
                id: nextId++,
                x: Math.min(startX, pos.x),
                y: Math.min(startY, pos.y),
                width: Math.abs(width),
                height: Math.abs(height),
                imageWidth: image.width, // Guardamos las dimensiones de la imagen
                imageHeight: image.height,
                content: null
            };
            hotspots.push(newHotspot);
            setMode('select');
            selectedHotspot = newHotspot;
            onSelectCallback(selectedHotspot);
        }
        redraw();
    }
    isDragging = false;
}

function handleMouseOut() {
    if (isDrawing || isDragging) {
        isDrawing = false;
        isDragging = false;
        redraw();
    }
}

// --- Funciones de Utilidad ---

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function getHotspotAt(x, y) {
    for (let i = hotspots.length - 1; i >= 0; i--) {
        const h = hotspots[i];
        if (x >= h.x && x <= h.x + h.width && y >= h.y && y <= h.y + h.height) {
            return h;
        }
    }
    return null;
}

function deselectAllHotspots() {
    if (selectedHotspot) {
        selectedHotspot = null;
        onDeselectCallback();
        redraw();
    }
}
import { HOTSPOT_CONFIG, MESSAGES } from './utils/constants.js';
import { validateHotspotSize } from './utils/validators.js';
import HistoryManager from './modules/history.js';

let canvas, ctx, image, hotspots = [];
let selectedHotspot = null;
let mode = 'select';
let isDrawing = false;
let startX, startY;
let onSelect, onDeselect;
const history = new HistoryManager();

export function init(canvasElement, onSelectCallback, onDeselectCallback) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    onSelect = onSelectCallback;
    onDeselect = onDeselectCallback;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
}

export function loadImage(img) {
    image = img;
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.display = 'block';
    hotspots = [];
    selectedHotspot = null;
    redraw();
}

export function setMode(newMode) {
    mode = newMode;
}

export function getSelected() {
    return selectedHotspot;
}

export function getAll() {
    return JSON.parse(JSON.stringify(hotspots));
}

export function setAll(hotspotsArray) {
    hotspots = JSON.parse(JSON.stringify(hotspotsArray));
    redraw();
}

export function addHotspot(hotspotData) {
    const hotspot = {
        id: hotspotData.id || Date.now(),
        x: hotspotData.x,
        y: hotspotData.y,
        width: hotspotData.width || 50,
        height: hotspotData.height || 50,
        content: hotspotData.content || {},
        type: hotspotData.type || 'text',
        createdAt: hotspotData.createdAt || new Date().toISOString(),
    };
    hotspots.push(hotspot);
    history.push(getAll());
    redraw();
    return hotspot;
}

export function updateHotspot(hotspotId, updates) {
    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (hotspot) {
        Object.assign(hotspot, updates);
        history.push(getAll());
        redraw();
    }
}

export function deleteSelected() {
    if (selectedHotspot) {
        hotspots = hotspots.filter(h => h.id !== selectedHotspot.id);
        selectedHotspot = null;
        if (onDeselect) onDeselect();
        redraw();
    }
}

function handleMouseDown(e) {
    if (!image) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'select') {
        const clicked = hotspots.find(h => 
            x >= h.x && x <= h.x + h.width &&
            y >= h.y && y <= h.y + h.height
        );
        selectHotspot(clicked || null);
    } else if (mode === 'draw') {
        isDrawing = true;
        startX = x;
        startY = y;
    }
}

function handleMouseMove(e) {
    if (!image || !isDrawing) return;
    redraw();
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = x - startX;
    const height = y - startY;
    
    ctx.strokeStyle = HOTSPOT_CONFIG.borderColor;
    ctx.lineWidth = HOTSPOT_CONFIG.borderWidth;
    ctx.strokeRect(startX, startY, width, height);
}

function handleMouseUp(e) {
    if (!image || !isDrawing) return;
    isDrawing = false;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = Math.abs(x - startX);
    const height = Math.abs(y - startY);
    
    if (validateHotspotSize(width, height, HOTSPOT_CONFIG.minSize)) {
        const hotspot = {
            id: Date.now(),
            x: Math.min(startX, x),
            y: Math.min(startY, y),
            width: width,
            height: height,
            content: {},
            type: 'text',
            createdAt: new Date().toISOString(),
        };
        hotspots.push(hotspot);
        history.push(getAll());
        selectHotspot(hotspot);
        redraw();
    }
}

function selectHotspot(hotspot) {
    selectedHotspot = hotspot;
    if (onSelect && hotspot) {
        onSelect(hotspot);
    }
    redraw();
}

function redraw() {
    if (!image) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    hotspots.forEach(hotspot => {
        const isSelected = selectedHotspot && selectedHotspot.id === hotspot.id;
        ctx.strokeStyle = isSelected ? '#ef4444' : HOTSPOT_CONFIG.borderColor;
        ctx.lineWidth = isSelected ? 3 : HOTSPOT_CONFIG.borderWidth;
        ctx.fillStyle = isSelected ? 'rgba(239, 68, 68, 0.2)' : HOTSPOT_CONFIG.fillColor;
        
        ctx.fillRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
        ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
    });
}

export default {
    init,
    loadImage,
    setMode,
    getSelected,
    getAll,
    setAll,
    addHotspot,
    updateHotspot,
    deleteSelected,
};

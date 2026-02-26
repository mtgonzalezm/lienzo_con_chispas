/**
 * ✏️ HOTSPOT_EDITOR.JS - Edición Mejorada de Puntos
 */

export class HotspotEditor {
    constructor() {
        this.selectedHotspot = null;
    }

    /**
     * Duplicar un hotspot
     */
    duplicate(hotspot, hotspots) {
        if (!hotspot) return null;
        
        const duplicated = {
            ...hotspot,
            id: Date.now(),
            x: hotspot.x + 5,
            y: hotspot.y + 5,
            createdAt: new Date().toISOString(),
        };
        
        hotspots.push(duplicated);
        return duplicated;
    }

    /**
     * Renombrar hotspot
     */
    rename(hotspot, newName) {
        if (hotspot && hotspot.content) {
            hotspot.content.title = newName;
            return true;
        }
        return false;
    }

    /**
     * Cambiar tipo de contenido
     */
    changeContentType(hotspot, newType) {
        if (hotspot) {
            hotspot.type = newType;
            hotspot.content = { type: newType };
            return true;
        }
        return false;
    }

    /**
     * Mover hotspot
     */
    move(hotspot, deltaX, deltaY, canvasWidth, canvasHeight) {
        if (hotspot) {
            hotspot.x = Math.max(0, Math.min(hotspot.x + deltaX, canvasWidth - hotspot.width));
            hotspot.y = Math.max(0, Math.min(hotspot.y + deltaY, canvasHeight - hotspot.height));
            return true;
        }
        return false;
    }

    /**
     * Redimensionar hotspot
     */
    resize(hotspot, newWidth, newHeight, minSize = 20) {
        if (hotspot && newWidth >= minSize && newHeight >= minSize) {
            hotspot.width = newWidth;
            hotspot.height = newHeight;
            return true;
        }
        return false;
    }

    /**
     * Obtener información del hotspot
     */
    getInfo(hotspot) {
        if (!hotspot) return null;
        
        return {
            id: hotspot.id,
            type: hotspot.type,
            position: { x: hotspot.x, y: hotspot.y },
            size: { width: hotspot.width, height: hotspot.height },
            content: hotspot.content || {},
            createdAt: hotspot.createdAt,
        };
    }

    /**
     * Validar hotspot
     */
    validate(hotspot) {
        const errors = [];
        
        if (!hotspot.id) errors.push('ID faltante');
        if (!hotspot.type) errors.push('Tipo no especificado');
        if (hotspot.x < 0 || hotspot.y < 0) errors.push('Posición negativa');
        if (hotspot.width < 20 || hotspot.height < 20) errors.push('Tamaño muy pequeño');
        
        return {
            valid: errors.length === 0,
            errors: errors,
        };
    }
}

export default HotspotEditor;

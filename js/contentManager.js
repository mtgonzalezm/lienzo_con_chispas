import * as Hotspots from './hotspots.js';

/**
 * Guarda el contenido para un hotspot específico.
 * @param {number} hotspotId - El ID del hotspot a actualizar.
 * @param {object} contentData - El objeto de contenido a guardar.
 */
export function saveContent(hotspotId, contentData) {
    if (hotspotId === null || contentData === null) {
        console.error("Error: Se necesita un ID de hotspot y datos de contenido para guardar.");
        return;
    }
    
    console.log(`Guardando contenido para el hotspot ${hotspotId}:`, contentData);
    Hotspots.updateHotspotContent(hotspotId, contentData);
}
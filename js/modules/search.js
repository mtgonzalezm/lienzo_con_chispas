/**
 * 🔍 SEARCH.JS - Búsqueda y Filtrado de Hotspots
 */

export class SearchManager {
    constructor(hotspots = []) {
        this.hotspots = hotspots;
        this.searchQuery = '';
        this.filterType = '';
    }

    /**
     * Establecer hotspots
     */
    setHotspots(hotspots) {
        this.hotspots = hotspots;
    }

    /**
     * Buscar por query
     */
    search(query) {
        this.searchQuery = query.toLowerCase();
        return this.getFiltered();
    }

    /**
     * Filtrar por tipo
     */
    filterByType(type) {
        this.filterType = type;
        return this.getFiltered();
    }

    /**
     * Obtener hotspots filtrados
     */
    getFiltered() {
        return this.hotspots.filter(hotspot => {
            const matchesSearch = !this.searchQuery || 
                hotspot.type.toLowerCase().includes(this.searchQuery) ||
                (hotspot.content?.title || '').toLowerCase().includes(this.searchQuery);
            
            const matchesType = !this.filterType || hotspot.type === this.filterType;

            return matchesSearch && matchesType;
        });
    }

    /**
     * Limpiar filtros
     */
    clear() {
        this.searchQuery = '';
        this.filterType = '';
        return this.hotspots;
    }

    /**
     * Obtener estadísticas
     */
    getStats() {
        return {
            total: this.hotspots.length,
            filtered: this.getFiltered().length,
            byType: this.getHotspotsByType(),
        };
    }

    /**
     * Hotspots agrupados por tipo
     */
    getHotspotsByType() {
        const grouped = {};
        this.hotspots.forEach(h => {
            grouped[h.type] = (grouped[h.type] || 0) + 1;
        });
        return grouped;
    }
}

export default SearchManager;

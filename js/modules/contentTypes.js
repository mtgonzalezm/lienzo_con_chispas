/**
 * 📝 CONTENT_TYPES.JS - Gestión de Tipos de Contenido
 */

export class ContentTypeManager {
    constructor() {
        this.types = {
            text: {
                id: 'text',
                label: 'Texto Explicativo',
                fields: ['title', 'body'],
            },
            link: {
                id: 'link',
                label: 'Enlace a Recurso',
                fields: ['url', 'text'],
            },
            audio: {
                id: 'audio',
                label: 'Audio 🎵',
                fields: ['url', 'title'],
            },
            video: {
                id: 'video',
                label: 'Video 🎬',
                fields: ['url', 'title'],
            },
            imagen: {
                id: 'imagen',
                label: 'Imagen 🖼️',
                fields: ['url', 'alt'],
            },
            codigo: {
                id: 'codigo',
                label: 'Código 💻',
                fields: ['code', 'language'],
            },
        };
    }

    /**
     * Obtener todos los tipos
     */
    getAll() {
        return Object.values(this.types);
    }

    /**
     * Obtener tipo específico
     */
    getType(typeId) {
        return this.types[typeId];
    }

    /**
     * Validar contenido por tipo
     */
    validateContent(typeId, content) {
        const type = this.types[typeId];
        if (!type) return { valid: false, error: 'Tipo no válido' };

        const errors = [];

        if (typeId === 'text') {
            if (!content.body || content.body.trim().length === 0) {
                errors.push('El cuerpo del texto es obligatorio');
            }
        } else if (typeId === 'link') {
            if (!content.url || content.url.trim().length === 0) {
                errors.push('La URL es obligatoria');
            }
            if (!content.text || content.text.trim().length === 0) {
                errors.push('El texto del enlace es obligatorio');
            }
        } else if (typeId === 'audio' || typeId === 'video' || typeId === 'imagen') {
            if (!content.url || content.url.trim().length === 0) {
                errors.push('La URL es obligatoria');
            }
        } else if (typeId === 'codigo') {
            if (!content.code || content.code.trim().length === 0) {
                errors.push('El código es obligatorio');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
        };
    }

    /**
     * Obtener fields de un tipo
     */
    getFields(typeId) {
        const type = this.types[typeId];
        return type ? type.fields : [];
    }

    /**
     * Crear contenido vacío del tipo
     */
    createEmpty(typeId) {
        const fields = this.getFields(typeId);
        const content = { type: typeId };
        fields.forEach(field => {
            content[field] = '';
        });
        return content;
    }
}

export default ContentTypeManager;

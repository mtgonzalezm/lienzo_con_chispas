/**
 * ⚙️ CONSTANTS.JS - Configuración Centralizada
 */

export const COLORS = {
  primary: '#2563eb',
  success: '#16a34a',
  warning: '#ea580c',
  danger: '#dc2626',
  gray: '#6b7280',
};

export const CONTENT_TYPES = {
  TEXT: 'text',
  LINK: 'link',
};

export const CONTENT_TYPES_CONFIG = [
  { id: 'text', label: 'Texto Explicativo' },
  { id: 'link', label: 'Enlace a Recurso' },
];

export const MESSAGES = {
  SUCCESS: {
    hotspotCreated: 'Zona interactiva creada ✓',
    contentSaved: 'Contenido guardado ✓',
    hotspotDeleted: 'Zona eliminada ✓',
  },
  ERROR: {
    imageRequired: 'Por favor, carga una imagen primero',
    contentEmpty: 'El contenido no puede estar vacío',
    invalidUrl: 'URL no válida',
  },
};

export const STORAGE_KEYS = {
  PROJECT: 'imagen-explora-project',
  HOTSPOTS: 'imagen-explora-hotspots',
  IMAGE: 'imagen-explora-image',
};

export default {
  COLORS,
  CONTENT_TYPES,
  CONTENT_TYPES_CONFIG,
  MESSAGES,
  STORAGE_KEYS,
};

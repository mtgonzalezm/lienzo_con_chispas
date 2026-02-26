# 🔧 Guía de Desarrollo

Documentación técnica para desarrolladores.

## Módulos Principales

### `js/utils/`
- **constants.js** - Configuración centralizada
- **validators.js** - Validación reutilizable
- **storage.js** - LocalStorage helpers

### `js/modules/`
- **history.js** - Sistema undo/redo
- **search.js** - Búsqueda y filtrado
- **hotspotEditor.js** - Edición de puntos
- **contentTypes.js** - Gestión de tipos

## Flujo de Datos
```
index.html → main.js → modules → canvas
```

## Crear Nuevo Tipo de Contenido

1. Agregar en `constants.js`
2. Agregar validador en `contentTypes.js`
3. Agregar UI en `index.html`
4. Agregar renderización en `contentManager.js`

## Testing
```bash
node -c js/main.js
for f in js/modules/*.js; do node -c "$f"; done
```

## Debugging
```javascript
console.log(Hotspots.getAll());
console.log(history);
console.log(localStorage);
console.log(searchManager.getStats());
```

## Métricas

- Total líneas: ~1,500
- Módulos: 7
- Funciones: 50+
- Tipos de contenido: 6

---
Versión: 2.1 | Febrero 2026

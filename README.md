# 🎨 Imagen Explora v2.1

Editor de imágenes interactivas con hotspots personalizables.

## ✨ Características

### FASE 1: Estructura Base
- ✅ Arquitectura modular y escalable
- ✅ Constantes centralizadas
- ✅ Validación reutilizable
- ✅ LocalStorage para persistencia
- ✅ Sistema de undo/redo

### FASE 2: Funcionalidades Avanzadas
- ✅ Búsqueda y filtrado de puntos
- ✅ Edición mejorada (duplicar, mover, redimensionar)
- ✅ 6 tipos de contenido (texto, enlace, audio, video, imagen, código)
- ✅ Notificaciones visuales
- ✅ Auto-guardado automático

## 🎯 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+S` | Guardar proyecto |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+D` | Duplicar punto |
| `Supr` | Eliminar punto |

## 📁 Estructura de Carpetas
```
js/
├── utils/              # Utilidades reutilizables
│   ├── constants.js    # Configuración centralizada
│   ├── validators.js   # Validación
│   └── storage.js      # LocalStorage helpers
├── modules/            # Módulos funcionales
│   ├── history.js      # Undo/Redo
│   ├── search.js       # Búsqueda y filtrado
│   ├── hotspotEditor.js # Edición de puntos
│   └── contentTypes.js # Gestión de tipos
├── main.js             # Punto de entrada
├── hotspots.js         # Gestión de hotspots
├── ui.js               # Interfaz de usuario
├── contentManager.js    # Gestión de contenido
└── export.js           # Exportación
```

## 🚀 Cómo Usar

1. **Cargar imagen**: Haz clic en "Cargar Imagen"
2. **Crear zona**: Modo "Dibujar" → Arrastra para crear zona
3. **Editar contenido**: Selecciona zona → "Editar Contenido"
4. **Guardar**: Ctrl+S o botón "Guardar Proyecto"
5. **Exportar**: Botón "Exportar" para descargar HTML

## 💾 Almacenamiento

Los proyectos se guardan automáticamente en localStorage. También puedes:
- **Guardar JSON**: Descarga el proyecto completo
- **Exportar HTML**: Crea una página web interactiva

## 🔧 Módulos

### `constants.js`
Configuración centralizada: colores, mensajes, tipos de contenido, keys de storage.

### `validators.js`
Funciones de validación para contenido, archivos e imágenes.

### `storage.js`
Helpers para guardar/cargar proyectos en localStorage.

### `history.js`
Sistema de undo/redo con máximo 50 estados.

### `search.js`
Búsqueda y filtrado de hotspots por tipo y contenido.

### `hotspotEditor.js`
Edición avanzada: duplicar, renombrar, mover, redimensionar.

### `contentTypes.js`
Gestión de 6 tipos de contenido con validación específica.

## 📊 Tipos de Contenido

1. **Texto** - Título + descripción
2. **Enlace** - URL + texto del botón
3. **Audio** - Reproductor de audio
4. **Video** - Reproductor de video
5. **Imagen** - Visualizador de imagen
6. **Código** - Editor de código con resalte

## 🛠️ Desarrollo

### Crear nuevo tipo de contenido

1. Agregar en `constants.js`:
```javascript
export const CONTENT_TYPES_CONFIG = [
  { id: 'miTipo', label: 'Mi Tipo' }
];
```

2. Agregar validador en `contentTypes.js`:
```javascript
validateContent(typeId, content) {
  if (typeId === 'miTipo') {
    // validar...
  }
}
```

3. Agregar UI en `index.html`:
```html
<div id="content-miTipo-group" class="content-group hidden">
  <!-- campos aquí -->
</div>
```

## 📈 Próximas Mejoras

- [ ] Capas y ordenamiento
- [ ] Zoom y pan del canvas
- [ ] Exportar como imagen (PNG/JPG)
- [ ] Temas personalizables
- [ ] Colaboración en tiempo real
- [ ] API para integraciones

## 📝 Notas Técnicas

- Usa `localStorage` para persistencia (5MB máximo)
- Canvas para renderizar hotspots
- ES6 modules para organización
- Tailwind CSS para estilos
- Historial limitado a 50 estados

## 🐛 Troubleshooting

**Problema**: Los hotspots no se muestran
- Solución: Verifica que la imagen se cargó correctamente

**Problema**: Los cambios no se guardan
- Solución: Verifica que localStorage está habilitado

**Problema**: El undo/redo no funciona
- Solución: El historial se limpia al cargar imagen nueva

## 📄 Licencia

MIT

---

**Versión**: 2.1
**Última actualización**: Febrero 2026
**Estado**: Producción

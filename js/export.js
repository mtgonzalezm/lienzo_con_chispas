import * as Hotspots from './hotspots.js';

/**
 * Abre una nueva pestaña con una vista previa del proyecto interactivo.
 */
export function preview() {
    const projectData = Hotspots.getProjectData();
    if (!projectData.imageDataUrl) {
        alert("Primero debes cargar una imagen.");
        return;
    }

    const htmlContent = generateInteractiveHTML(projectData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

/**
 * Genera y descarga el proyecto como un archivo HTML.
 */
export function exportToFile() {
    const projectData = Hotspots.getProjectData();
     if (!projectData.imageDataUrl) {
        alert("Primero debes cargar una imagen.");
        return;
    }

    const htmlContent = generateInteractiveHTML(projectData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'imagen-interactiva.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


/**
 * Construye el contenido completo del archivo HTML interactivo.
 * @param {object} projectData - Datos del proyecto { imageDataUrl, hotspots }.
 * @returns {string} - El string completo del archivo HTML.
 */
function generateInteractiveHTML({ imageDataUrl, hotspots }) {
    // Convierte los datos de los hotspots a un string JSON seguro para inyectar en el script
    const hotspotsJson = JSON.stringify(hotspots);

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imagen Interactiva</title>
    <style>
        /* Estilos generales y para el contenedor */
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; background-color: #f0f2f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        #interactive-container { position: relative; max-width: 100%; }
        #interactive-container img { display: block; width: 100%; height: auto; }
        
        /* Estilos de los hotspots */
        .hotspot {
            position: absolute;
            background-color: rgba(29, 78, 216, 0.7);
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            width: 30px;
            height: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: transform 0.2s, background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }
        .hotspot:hover { transform: scale(1.2); background-color: rgba(255, 204, 0, 0.9); }
        .hotspot::before { content: '+'; }

        /* Estilos del popup de contenido */
        .hotspot-popup {
            display: none;
            position: absolute;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            padding: 15px;
            width: 280px;
            z-index: 100;
            transform: translate(-50%, 15px); /* Centrado y con espacio */
            color: #333;
        }
        .hotspot-popup.active { display: block; }
        .hotspot-popup h3 { margin: 0 0 10px 0; font-size: 1.1em; color: #1D4ED8; }
        .hotspot-popup p { margin: 0 0 15px 0; line-height: 1.5; }
        .hotspot-popup a {
            display: inline-block;
            background-color: #1D4ED8;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .hotspot-popup a:hover { background-color: #2563EB; }
        .popup-close {
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 24px;
            color: #aaa;
            cursor: pointer;
            border: none;
            background: none;
        }
        .popup-close:hover { color: #333; }
    </style>
</head>
<body>

<div id="interactive-container">
    <img src="${imageDataUrl}" alt="Imagen base interactiva">
    <!-- Los hotspots se añadirán aquí dinámicamente -->
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('interactive-container');
        const image = container.querySelector('img');
        const hotspotsData = ${hotspotsJson};
        let activePopup = null;

        // Espera a que la imagen se cargue para tener sus dimensiones reales
        image.onload = () => {
            const imageWidth = image.offsetWidth;
            const imageHeight = image.offsetHeight;

            hotspotsData.forEach(data => {
                if (!data.content) return; // No crea hotspot si no tiene contenido

                const hotspot = document.createElement('div');
                hotspot.className = 'hotspot';
                hotspot.style.left = \`\${(data.x / data.imageWidth) * 100}%\`;
                hotspot.style.top = \`\${(data.y / data.imageHeight) * 100}%\`;
                
                // Centrar el hotspot en el punto de origen
                hotspot.style.transform = 'translate(-50%, -50%)';

                const popup = createPopup(data.content);
                
                hotspot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activePopup && activePopup !== popup) {
                        activePopup.classList.remove('active');
                    }
                    popup.classList.toggle('active');
                    activePopup = popup.classList.contains('active') ? popup : null;
                });

                container.appendChild(hotspot);
                container.appendChild(popup);
                
                // Posicionar el popup relativo al hotspot
                popup.style.left = hotspot.style.left;
                popup.style.top = \`calc(\${hotspot.style.top} + 20px)\`;
            });
        };

        // Si la imagen ya está en caché, puede que 'onload' no se dispare
        if (image.complete) {
            image.onload();
        }

        function createPopup(content) {
            const popup = document.createElement('div');
            popup.className = 'hotspot-popup';
            
            let innerHTML = \`<button class="popup-close">&times;</button>\`;
            if (content.type === 'text') {
                if(content.title) innerHTML += \`<h3>\${content.title}</h3>\`;
                if(content.body) innerHTML += \`<p>\${content.body}</p>\`;
            } else if (content.type === 'link') {
                innerHTML += \`<a href="\${content.url}" target="_blank">\${content.text || 'Abrir enlace'}</a>\`;
            }
            popup.innerHTML = innerHTML;

            popup.querySelector('.popup-close').addEventListener('click', (e) => {
                e.stopPropagation();
                popup.classList.remove('active');
                activePopup = null;
            });
            return popup;
        }

        // Cierra el popup si se hace clic fuera
        document.addEventListener('click', () => {
            if (activePopup) {
                activePopup.classList.remove('active');
                activePopup = null;
            }
        });
    });
<\/script>

</body>
</html>
    `;
}

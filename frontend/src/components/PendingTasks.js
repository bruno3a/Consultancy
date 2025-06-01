import React, { useState } from 'react';
import { ListChecks } from 'lucide-react'; // Icono para las tareas

const PENDING_TASKS = [
  "Actualizar URLs con el dominio real (Open Graph, Twitter, Canonical) en `frontend/public/index.html`.",
  "Crear y añadir `og-image.png` en `frontend/public/` para Open Graph y Twitter.",
  "Revisar y configurar `preload` para fuentes y CSS crítico (actualmente comentado en `frontend/public/index.html`).",
  "Asegurar que el `Sitemap` en `robots.txt` apunte al dominio real."
];

const PendingTasksViewer = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="fixed bottom-6 left-6 z-50 group" // group para controlar el hover del panel
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        className="p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300 focus:outline-none"
        aria-label="Ver tareas pendientes de configuración"
      >
        <ListChecks size={24} />
      </button>

      {isHovering && (
        <div className="absolute bottom-full left-0 mb-2 w-96 p-4 bg-gray-800 text-white rounded-lg shadow-xl border border-gray-600 transition-opacity duration-300 opacity-100">
          <h4 className="font-semibold text-sm mb-2 text-amber-400 border-b border-amber-400/50 pb-1">Recordatorios / Pendientes:</h4>
          <ul className="list-disc list-inside space-y-1.5 text-xs mt-2">
            {PENDING_TASKS.map((task, index) => (
              <li key={index} className="leading-snug">{task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PendingTasksViewer;
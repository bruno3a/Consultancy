import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const TermsOfUsePopup = ({ onClose }) => {
  const termsData = {
    lastUpdated: "5 de junio de 2025",
    title: "Términos de Uso",
    introduction: "Estos términos regulan el uso del chatbot ofrecido por NeuraSur para la atención de consultas comerciales.",
    sections: [
      {
        heading: "1. Uso del chatbot",
        content: "El usuario acepta utilizar el chatbot únicamente con fines lícitos, relacionados con la solicitud de información sobre nuestros servicios."
      },
      {
        heading: "2. Contenido de las respuestas",
        content: "Las respuestas del chatbot son informativas y no constituyen un compromiso formal, salvo que se indique lo contrario por un asesor humano."
      },
      {
        heading: "3. Responsabilidad",
        content: "NeuraSur no se responsabiliza por el uso indebido del chatbot ni por errores derivados de información incompleta o incorrecta provista por el usuario."
      },
      {
        heading: "4. Privacidad, Protección de Datos y Cookies",
        content: "El uso del chatbot y de nuestro sitio web implica la aceptación de nuestra Política de Privacidad, la cual detalla cómo manejamos tus datos personales y el uso de cookies en nuestro sitio."
      },
      {
        heading: "5. Propiedad intelectual",
        content: "Todo el contenido provisto por el chatbot pertenece a NeuraSur y no puede ser reproducido sin autorización previa."
      },
      {
        heading: "6. Modificaciones",
        content: "NeuraSur se reserva el derecho de modificar estos términos en cualquier momento. Las actualizaciones se publicarán en esta misma sección."
      }
    ]
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
         className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
         onClick={onClose} // Close on overlay click
         role="dialog"
         aria-modal="true"
         aria-labelledby="terms-of-use-title"
         // aria-describedby="terms-of-use-description" // Opcional
    >
      <div 
        className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700 text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
          aria-label="Cerrar Términos de Uso"
        >
          <X size={24} />
        </button>
        
        <h2 id="terms-of-use-title" className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-3">{termsData.title}</h2>
        <p className="text-xs text-gray-400 mb-6 italic">Última actualización: {termsData.lastUpdated}</p>
        
        <p className="mb-6 leading-relaxed">{termsData.introduction}</p>
        
        <div className="space-y-5">
          {termsData.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg sm:text-xl font-semibold text-teal-300 mb-2">{section.heading}</h3>
              {section.content && <p className="mb-2 leading-relaxed">{section.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePopup;
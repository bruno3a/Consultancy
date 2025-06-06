import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const PrivacyPolicyPopup = ({ onClose }) => {
  const policyData = {
    lastUpdated: "5 de junio de 2025",
    title: "Política de Privacidad",
    // Updated company name to NeuraSur
    introduction: "En NeuraSur valoramos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, usamos y protegemos los datos personales que se comparten a través de nuestro chatbot o cualquier otro canal de comunicación.",
    sections: [
      {
        heading: "1. Información que recopilamos",
        content: "A través del chatbot, podemos solicitar o recibir los siguientes datos personales:",
        points: [
          "Nombre y apellido",
          "Número de teléfono",
          "Ubicación o ciudad",
          "Información relacionada con la consulta o necesidad comercial",
          "Otros datos que el usuario decida compartir voluntariamente"
        ]
      },
      {
        heading: "2. Finalidad del tratamiento de datos",
        content: "Utilizamos los datos para:",
        points: [
          "Responder consultas sobre nuestros servicios",
          "Brindar asesoramiento comercial personalizado",
          "Agendar llamadas o reuniones informativas",
          "Elaborar cotizaciones o propuestas comerciales",
          "Mejorar la calidad de atención y el funcionamiento del chatbot"
        ]
      },
      {
        heading: "3. Base legal del tratamiento",
        content: "El tratamiento de los datos se basa en el consentimiento del usuario y/o en la necesidad de ejecutar acciones previas a una posible relación contractual."
      },
      {
        heading: "4. Compartición de datos",
        content: "No compartimos los datos con terceros, salvo requerimiento legal o si fuera necesario para brindar el servicio solicitado (por ejemplo, agendar una videollamada con un asesor)."
      },
      {
        heading: "5. Almacenamiento y seguridad",
        content: "Los datos se almacenan en entornos seguros y se toman medidas razonables para evitar accesos no autorizados o usos indebidos."
      },
      {
        heading: "6. Derechos del usuario",
        content: "El usuario puede:",
        points: [
          "Acceder a sus datos",
          "Rectificarlos",
          "Solicitar su eliminación",
          "Retirar su consentimiento"
        ],
        contactInfo: {
          textBefore: "Para ejercer estos derechos, puede escribir a ",
          email: "br1trezza@gmail.com", // Kept the provided email
          textAfter: "."
        }
      },
      {
        heading: "7. Uso de Cookies",
        content: "Nuestro sitio web utiliza cookies y tecnologías similares para mejorar tu experiencia de navegación, analizar el tráfico del sitio y, en algunos casos, personalizar el contenido y la publicidad. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio.",
        points: [
          "Cookies Esenciales: Son necesarias para el funcionamiento básico del sitio web y no se pueden desactivar en nuestros sistemas. Generalmente se configuran en respuesta a acciones realizadas por ti que equivalen a una solicitud de servicios, como establecer tus preferencias de privacidad, iniciar sesión o completar formularios.",
          "Cookies de Rendimiento y Análisis: Nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares, y a ver cómo los visitantes se mueven por el sitio (por ejemplo, mediante Google Analytics). Toda la información que recopilan estas cookies es agregada y, por lo tanto, anónima.",
          "Cookies de Funcionalidad: Permiten que el sitio web recuerde las elecciones que haces (como tu nombre de usuario, idioma o la región en la que te encuentras) y proporcionan características mejoradas y más personales.",
          "Cookies de Publicidad (si aplica): Pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Estas empresas pueden utilizarlas para crear un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios."
        ],
        additionalContent: "Puedes configurar tu navegador para bloquear o alertarte sobre estas cookies, pero algunas partes del sitio no funcionarán. Al continuar utilizando nuestro sitio sin cambiar la configuración de tu navegador, aceptas nuestro uso de cookies como se describe. Para ejercer tus derechos sobre los datos recopilados por cookies o para obtener más información, por favor contáctanos a través de la dirección de correo electrónico proporcionada."
      },
      {
        heading: "8. Cambios en la política",
        content: "Nos reservamos el derecho de actualizar esta política. Las modificaciones serán publicadas en esta misma página."
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
         aria-labelledby="privacy-policy-title"
         // aria-describedby="privacy-policy-description" // Opcional si la introducción sirve como descripción
    >
      <div 
        className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700 text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
          aria-label="Cerrar política de privacidad"
        >
          <X size={24} />
        </button>
        
        <h2 id="privacy-policy-title" className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-3">{policyData.title}</h2>
        <p className="text-xs text-gray-400 mb-6 italic">Última actualización: {policyData.lastUpdated}</p>
        
        <p className="mb-6 leading-relaxed">{policyData.introduction}</p>
        
        <div className="space-y-5">
          {policyData.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg sm:text-xl font-semibold text-teal-300 mb-2">{section.heading}</h3>
              {section.content && <p className="mb-2 leading-relaxed">{section.content}</p>}
              {section.points && (
                <ul className="list-disc list-inside space-y-1.5 pl-4 mb-2 text-gray-300">
                  {section.points.map((point, pIndex) => (
                    <li key={pIndex} className="leading-relaxed">{point}</li>
                  ))}
                </ul>
              )}
              {section.contactInfo && (
                <p className="leading-relaxed">
                  {section.contactInfo.textBefore}
                  <a href={`mailto:${section.contactInfo.email}`} className="text-emerald-400 hover:underline">
                    {section.contactInfo.email}
                  </a>
                  {section.contactInfo.textAfter}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPopup;
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Usaremos un ícono para el mensaje de error

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de fallback.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores externo aquí
    console.error("Error capturado por ChatErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo }); // Guardar errorInfo para posible depuración
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback cuando hay un error en el chat
      return (
        <div className="chat-widget-container"> {/* Mantiene el posicionamiento */}
          <div
            className="chat-launcher-button" // Reutiliza la clase para la apariencia de burbuja
            style={{
              backgroundColor: '#ef4444', // Rojo (Tailwind red-500) para indicar error
              color: 'white',
              cursor: 'default',          // Cursor por defecto, ya que no es interactivo
              // Los estilos de tamaño, borde redondeado, etc., vienen de .chat-launcher-button
            }}
            title={
              this.state.error 
              ? `Chat no disponible: ${this.state.error.message}. Intente recargar o vuelva más tarde.`
              : "Chat no disponible. Intente recargar la página o vuelva más tarde."
            }
          >
            {/* Ícono de advertencia. El color se hereda o se puede especificar si es necesario. */}
            <AlertTriangle size={28} /> 
          </div>
        </div>
      );
    }

    // Si no hay error, renderiza los componentes hijos normalmente
    return this.props.children;
  }
}

export default ChatErrorBoundary;

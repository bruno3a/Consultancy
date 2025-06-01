import React from 'react';

const PreviewBanner = () => {
  const bannerStyle = {
    backgroundColor: '#ffcc00', // Un amarillo para destacar
    color: '#333',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    position: 'fixed', // Para que se mantenga visible
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000, // Para que esté por encima de otros elementos
  };

  return (
    <div style={bannerStyle}>
      ESTÁS VIENDO UNA VERSIÓN DE VISTA PREVIA (PREVIEW)
    </div>
  );
};

export default PreviewBanner;
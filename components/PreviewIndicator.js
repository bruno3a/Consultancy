const PreviewIndicator = () => {
  const vercelEnv = process.env.REACT_APP_VERCEL_ENV;
  
  // Temporal para debugging
  console.log('REACT_APP_VERCEL_ENV:', vercelEnv);
  
  if (vercelEnv === 'production') return null;

  return (
    <div className="preview-indicator">
      <span>Modo Preview - {vercelEnv?.toUpperCase() || 'LOCAL'}</span>
    </div>
  );
};

export default PreviewIndicator;
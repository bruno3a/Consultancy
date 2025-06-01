import React from 'react';

const PreviewBanner = () => {
  const textStyle = {
    color: '#fcd34d', // Tailwind amber-300
    fontSize: '0.75rem', // text-xs
    fontWeight: '600', // font-semibold
    marginLeft: '1rem', // ml-4
    padding: '0.25rem 0.5rem', // py-1 px-2
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '0.25rem', // rounded-sm
  };

  return (
    <span style={textStyle}>
      Modo Preview
    </span>
  );
};

export default PreviewBanner;
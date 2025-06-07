import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './components/LandingPage.js';
import "./App.css";

function App() {
  const isPreview = process.env.REACT_APP_VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
  const isProduction = process.env.REACT_APP_VERCEL_ENV === 'production';

  return (
    <div className="App">
      {/* PreviewBanner se renderizará dentro de LandingPage ahora */}
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  showPendingTasks={!isProduction}
                  isPreview={isPreview} // Pasamos isPreview como prop
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;

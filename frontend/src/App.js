import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage.js';
import PendingTasks from './components/PendingTasks.js'; // Asumiendo esta ruta
import PreviewBanner from './components/PreviewBanner.js';
import "./App.css";

function App() {
  const isPreview = process.env.REACT_APP_VERCEL_ENV === 'preview';
  const isProduction = process.env.REACT_APP_VERCEL_ENV === 'production';

  return (
    <div className="App">
      {/* PreviewBanner se renderizará dentro de LandingPage ahora */}
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
          {/* Si PendingTasks es una ruta separada y no parte de LandingPage: */}
          {/* {!isProduction && <Route path="/pending-tasks" element={<PendingTasks />} />} */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
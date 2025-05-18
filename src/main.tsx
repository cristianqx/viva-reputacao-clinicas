
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Adicionar importação da fonte Montserrat 
const loadFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// Carregar fontes antes de renderizar o aplicativo
loadFonts();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

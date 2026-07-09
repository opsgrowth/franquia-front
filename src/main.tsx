import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './franquia/cover-assets';
import App from './App';
import { StudentApp } from './franquia/student-app';

// Rota do COMPRADOR: /p/{slug} abre o app do produto (link mágico), fora do painel.
const isStudentRoute = window.location.pathname.startsWith('/p/');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isStudentRoute ? <StudentApp /> : <App />}
  </React.StrictMode>,
);

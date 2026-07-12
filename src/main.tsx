import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './franquia/cover-assets';
import App from './App';
import { StudentApp } from './franquia/student-app';
import { SetPasswordScreen } from './franquia/set-password';

// Quem renderiza:
//  - /p/{slug} (link mágico) → app do COMPRADOR.
//  - app INSTALADO abre em "/" (start_url do manifest): se há sessão de aluno persistida
//    E NÃO há sessão de criador (painel) → app do comprador. Assim o ícone na home do
//    comprador abre o CURSO dele, e o do admin/franqueado abre o painel.
const isSetPassword = window.location.pathname.startsWith('/definir-senha');
const isStudentRoute = window.location.pathname.startsWith('/p/');
const hasStudentToken = (() => { try { return !!localStorage.getItem('fia_student_token'); } catch { return false; } })();
const hasCreatorSession = (() => {
  try { return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.includes('auth-token')); } catch { return false; }
})();
const showStudent = isStudentRoute || (hasStudentToken && !hasCreatorSession);

// PWA adiado: NÃO registrar service worker (sw.js não existe → /sw.js cai no index.html e o
// registro falharia mesmo). Além disso, DESREGISTRA qualquer SW antigo — um SW obsoleto
// poderia servir resposta de API cacheada de OUTRO tenant (vazamento entre logins).
if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSetPassword ? <SetPasswordScreen /> : showStudent ? <StudentApp /> : <App />}
  </React.StrictMode>,
);

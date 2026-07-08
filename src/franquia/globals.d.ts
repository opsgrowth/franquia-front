// Permite acessos window.__go, window.FIXED_COVERS, window.COVER, etc. sem erro de tipo.
export {};
declare global {
  interface Window { [key: string]: any }
}

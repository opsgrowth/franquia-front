import React from 'react';

// Parser MÍNIMO de links [texto](url) para a descrição da aula (lesson.summary).
// Não usa lib de markdown nem dangerouslySetInnerHTML — a tela é servida a alunos de
// 385 franqueados. Reconhece SOMENTE a sintaxe [texto](url); qualquer coisa que não case
// (colchete/parêntese solto, url crua, esquema proibido, url relativa) fica como TEXTO literal.
//
// Segurança: a regex do destino exige http/https, então javascript:/data:/relativa NÃO casam
// e nunca viram <a>. A label é filho-texto do React → auto-escapada. Sem innerHTML.

// [texto](http(s)://... até espaço ou ')'). Global: varre todos os matches.
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function renderRichText(
  text?: string | null,
  linkStyle?: React.CSSProperties,
): React.ReactNode {
  if (!text) return text ?? null;
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    const [full, label, url] = m;
    // Allowlist defensivo (além da regex): só http/https vira link.
    if (!/^https?:\/\//i.test(url)) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline', ...linkStyle }}
      >
        {label}
      </a>,
    );
    last = m.index + full.length;
  }
  if (last === 0) return text; // nenhum link → devolve a string original intacta
  if (last < text.length) out.push(text.slice(last));
  return out;
}

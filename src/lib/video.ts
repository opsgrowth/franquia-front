// Vídeo: URL colada pelo criador → descritor de embed pro player do aluno.
// Cobre YouTube, Vimeo, arquivo direto (mp4/webm) e URLs de embed genéricas
// (Panda, Vturb, etc.). O criador cola o link; o aluno assiste — sem upload.
export type VideoEmbed = { kind: 'iframe' | 'file'; src: string } | null;

export function videoEmbed(url: any): VideoEmbed {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u) return null;
  // YouTube (watch?v=, youtu.be/, embed/, shorts/)
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return { kind: 'iframe', src: `https://www.youtube.com/embed/${m[1]}` };
  // Vimeo
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { kind: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` };
  // arquivo de vídeo direto
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(u)) return { kind: 'file', src: u };
  // fallback: qualquer https vira iframe (players de embed dão a própria URL)
  if (/^https?:\/\//i.test(u)) return { kind: 'iframe', src: u };
  return null;
}

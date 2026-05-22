// utils/escape.js
export function formatHTML(text) {
  // Convertir *texte* en <b>texte</b>
  return text.replace(/\*(.*?)\*/g, '<b>$1</b>');
}
export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;');
}

export function escAttr(str) {
  return escHtml(str).replace(/'/g, '&#39;');
}

export function escHtmlMultiline(str) {
  return escHtml(str).replace(/\r?\n/g, '<br>');
}

export function byId(id) {
  return document.getElementById(id);
}


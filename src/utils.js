/**
 * utils.js — small utility helpers used by the validator
 */
let idCounter = 0;

export function uid(prefix = 'fv') {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function addClass(el, cls) { el.classList.add(cls); }
export function removeClass(el, cls) { el.classList.remove(cls); }
export function isVisible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }

export function format(msg, ...args) {
  return msg.replace(/\{(\d+)\}/g, (m, i) => (args[i] != null ? args[i] : m));
}

export default { uid, addClass, removeClass, isVisible, format };


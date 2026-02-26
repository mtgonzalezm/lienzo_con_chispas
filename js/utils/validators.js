/**
 * ✅ VALIDATORS.JS - Validación Centralizada
 */

import { MESSAGES } from './constants.js';

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function validateTextContent(title, body) {
  if (!body || body.trim().length === 0) {
    return { valid: false, error: MESSAGES.ERROR.contentEmpty };
  }
  return { valid: true };
}

export function validateLinkContent(url, text) {
  if (!url || !isValidUrl(url)) {
    return { valid: false, error: MESSAGES.ERROR.invalidUrl };
  }
  if (!text || text.trim().length === 0) {
    return { valid: false, error: MESSAGES.ERROR.contentEmpty };
  }
  return { valid: true };
}

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: MESSAGES.ERROR.imageRequired };
  }
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }
  return { valid: true };
}

export function validateContent(type, content) {
  switch (type) {
    case 'text':
      return validateTextContent(content.title, content.body);
    case 'link':
      return validateLinkContent(content.url, content.text);
    default:
      return { valid: false, error: 'Tipo no válido' };
  }
}

export default {
  isValidUrl,
  validateTextContent,
  validateLinkContent,
  validateImageFile,
  validateContent,
};

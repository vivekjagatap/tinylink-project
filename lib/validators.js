// lib/validators.js
export const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function isValidCode(code) {
  return CODE_REGEX.test(code);
}

export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

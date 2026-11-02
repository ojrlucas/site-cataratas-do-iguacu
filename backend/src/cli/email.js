export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

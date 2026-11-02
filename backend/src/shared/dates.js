const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const isoDate = (date) => date.toISOString().slice(0, 10);
export const today = () => isoDate(new Date());
export const yesterday = () => isoDate(new Date(Date.now() - DAY_IN_MS));
export const isValidDate = (text) => !Number.isNaN(Date.parse(text));

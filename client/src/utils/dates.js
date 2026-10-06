export const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const pad = (n) => String(n).padStart(2, "0");

// Fecha como "dd/mm/yyyy" (formato en que se guardan citas y suscripciones).
export const formatDate = (date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

// Convierte "dd/mm/yyyy" en Date (a medianoche).
export const parseDate = (str) => {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// true si la suscripción ("dd/mm/yyyy") ya venció.
export const isExpired = (str) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(str) < today;
};

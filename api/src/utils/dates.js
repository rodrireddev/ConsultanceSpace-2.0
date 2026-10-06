// Las suscripciones se guardan como string "dd/mm/yyyy".
const pad = (n) => String(n).padStart(2, "0");

const formatDate = (date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

const parseDate = (str) => {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, days) => {
  const result = new Date(date.valueOf());
  result.setDate(result.getDate() + days);
  return result;
};

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isExpired = (str) => parseDate(str) < startOfToday();

module.exports = { formatDate, parseDate, addDays, isExpired };

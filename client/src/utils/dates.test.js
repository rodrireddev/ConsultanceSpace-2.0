import { DAY_NAMES, formatDate, isExpired, parseDate } from "./dates";

test("formatDate y parseDate son inversas (dd/mm/yyyy)", () => {
  const date = new Date(2021, 8, 1);
  expect(formatDate(date)).toBe("01/09/2021");
  expect(parseDate("01/09/2021").getTime()).toBe(date.getTime());
});

test("isExpired compara contra hoy", () => {
  const day = 24 * 60 * 60 * 1000;
  expect(isExpired(formatDate(new Date(Date.now() - 2 * day)))).toBe(true);
  expect(isExpired(formatDate(new Date()))).toBe(false);
  expect(isExpired(formatDate(new Date(Date.now() + 2 * day)))).toBe(false);
});

test("DAY_NAMES arranca en domingo como Date#getDay", () => {
  expect(DAY_NAMES[new Date(2021, 8, 5).getDay()]).toBe("domingo");
});

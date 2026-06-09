import { Localization } from "@infomaximum/localization";
import { EFormatTypes } from "./utils/const";
import { getFormattedValue } from "./getFormattedValue";

/**
 * BI-15913 — маски длительности год (Y), месяц (M), миллисекунда (S) в режиме «Настроить»,
 * регистрозависимость и обратная совместимость старых масок.
 * Длина: год = 365 дней, месяц = год / 12 (соглашение dayjs). Значение приходит в секундах.
 */
const ru = new Localization({ language: Localization.Language.ru }).getLanguage();
const en = new Localization({ language: Localization.Language.en }).getLanguage();

const DAY = 86400;
const fmt = (value: number, mask: string, language = ru) =>
  getFormattedValue({ value, formatType: EFormatTypes.DURATION, formatting: mask, language });

describe("getFormattedValue — длительность: маски года/месяца/миллисекунд (BI-15913)", () => {
  const cases: { value: number; mask: string; expected: string }[] = [
    { value: 400 * DAY, mask: "YYY:ddd", expected: "01 г 35 дн" },
    { value: 400 * DAY, mask: "YYY:MMM:ddd", expected: "01 г 01 мес 04 дн" },
    { value: 45 * DAY, mask: "MMM:ddd", expected: "01 мес 14 дн" },
    { value: 360 * DAY, mask: "YYY:MMM", expected: "00 г 11 мес" },
    { value: 2 * 365 * DAY, mask: "Y", expected: "2" },
    { value: 2 * 365 * DAY, mask: "YY", expected: "02" },
    { value: 2 * 365 * DAY, mask: "YYY", expected: "02 г" },
    { value: 45 * DAY, mask: "M", expected: "1" },
    { value: 45 * DAY, mask: "m", expected: "64800" },
  ];

  cases.forEach(({ value, mask, expected }) => {
    it(`длительность ${value}с, маска "${mask}" → "${expected}"`, () => {
      expect(fmt(value, mask)).toBe(expected);
    });
  });

  it("суффикс месяца (en 'mo') не повреждается заменой токена минут 'm': MMM:m", () => {
    // 1 месяц + 5 минут = 2 628 300 с. Без двухпроходной подстановки токен 'm' затёр бы 'mo'.
    expect(fmt(2628300, "MMM:m", en)).toBe("01mo 5");
  });

  it("S — миллисекунды, s — секунды (регистр значим)", () => {
    expect(fmt(3.456, "ss:SSS")).toBe("03:456 мс");
    expect(fmt(3.456, "SSS")).not.toBe(fmt(3.456, "sss"));
  });
});

describe("getFormattedValue — длительность: регистр и обратная совместимость (BI-15913)", () => {
  const V = 183845; // 2 дня 3 часа 4 минуты 5 секунд

  it("старые строчные маски работают как раньше", () => {
    expect(fmt(V, "dd:hh:mm:ss")).toBe("02:03:04:05");
    expect(fmt(V, "hh:mm:ss")).toBe("51:04:05"); // 2д3ч = 51ч
  });

  it("заглавные D/H приводятся к строчным (старые отчёты не ломаются)", () => {
    expect(fmt(V, "DD:HH:mm:ss")).toBe("02:03:04:05");
    expect(fmt(V, "HH:mm:ss")).toBe(fmt(V, "hh:mm:ss"));
    expect(fmt(V, "DDD")).toBe(fmt(V, "ddd"));
  });

  it("AUTO определяется в любом регистре", () => {
    expect(fmt(V, "AUTO")).toBe(fmt(V, "auto"));
    expect(fmt(V, "AUTO")).not.toContain("еправиль");
  });

  it("заглавные M/S меняют смысл (M→месяц, S→мс), строчные mm/ss не затронуты", () => {
    expect(fmt(V, "mm")).not.toBe(fmt(V, "MM"));
    expect(fmt(V, "ss")).not.toBe(fmt(V, "SS"));
  });
});

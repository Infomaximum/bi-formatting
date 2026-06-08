import { calcFormattedDurationRule } from "./calcFormattedDurationRule";

/**
 * BI-15913 — разбор шаблона длительности: порядок разрядов и валидация.
 */
describe("calcFormattedDurationRule (BI-15913)", () => {
  it("сортирует includedSegments по величине разряда (год → месяц → день → минута)", () => {
    const rule = calcFormattedDurationRule("ddd:YYY:mm:MMM");
    expect(rule.includedSegments).toEqual(["Y", "M", "d", "m"]);
  });

  it("возвращает ошибку форматирования на неизвестной маске", () => {
    expect(calcFormattedDurationRule("XXX").error).toBeTruthy();
  });
});

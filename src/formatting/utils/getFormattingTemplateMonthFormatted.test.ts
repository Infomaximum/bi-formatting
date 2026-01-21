import { forEach } from "lodash";
import { getFormattingTemplateMonthFormatted } from "./getFormattingTemplateMonthFormatted";
import { ELanguages, Localization } from "@infomaximum/localization";

const ruLocalization = new Localization({ language: ELanguages.ru });
const enLocalization = new Localization({ language: ELanguages.en });

const ruTestCases = {
  1: { numberMonth: 5, template: "M-YYYY", result: "M-YYYY" },
  2: { numberMonth: 11, template: "MM/YYYY", result: "MM/YYYY" },
  3: { numberMonth: 9, template: "MMM YYYY", result: "[Сен] YYYY" },
  4: { numberMonth: 3, template: "MMMM.YYYY", result: "[Март].YYYY" },
};

const enTestCases = {
  1: { numberMonth: 5, template: "M-YY", result: "M-YY" },
  2: { numberMonth: 11, template: "MM YY", result: "MM YY" },
  3: { numberMonth: 9, template: "MMM YY", result: "[Sep] YY" },
  4: { numberMonth: 3, template: "MMMM YY", result: "[March] YY" },
};

describe("тестирование getFormattingTemplateMonthFormatted", () => {
  describe("RU", () => {
    forEach(ruTestCases, (testCase, key) => {
      it(`RU case ${key}: шаблон ${testCase.template}`, () => {
        expect(
          getFormattingTemplateMonthFormatted(
            testCase.numberMonth,
            testCase.template,
            ruLocalization.getLanguage()
          )
        ).toBe(testCase.result);
      });
    });
  });

  describe("EN", () => {
    forEach(enTestCases, (testCase, key) => {
      it(`EN case ${key}: шаблон ${testCase.template}`, () => {
        expect(
          getFormattingTemplateMonthFormatted(
            testCase.numberMonth,
            testCase.template,
            enLocalization.getLanguage()
          )
        ).toBe(testCase.result);
      });
    });
  });
});

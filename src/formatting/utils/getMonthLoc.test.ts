import { forEach } from "lodash";
import { ELanguages, Localization } from "@infomaximum/localization";
import { getMonthLoc } from "./getMonthLoc";

const ruTestCases = {
  1: {
    params: { language: ELanguages.ru, numberOfMonth: 9, lengthFormat: "short" as const },
    result: "Сен",
  },
  2: {
    params: {
      language: ELanguages.ru,
      numberOfMonth: 5,
      lengthFormat: "short" as const,
      genitive: true,
    },
    result: "Мая",
  },
  3: {
    params: { language: ELanguages.ru, numberOfMonth: 3, lengthFormat: "long" as const },
    result: "Март",
  },
  4: {
    params: {
      language: ELanguages.ru,
      numberOfMonth: 1,
      lengthFormat: "long" as const,
      genitive: true,
    },
    result: "Января",
  },
};

const enTestCases = {
  1: {
    params: { language: ELanguages.en, numberOfMonth: 9, lengthFormat: "short" as const },
    result: "Sep",
  },
  2: {
    params: { language: ELanguages.en, numberOfMonth: 3, lengthFormat: "long" as const },
    result: "March",
  },
};

describe("тестирование getFormattingTemplateMonthFormatted", () => {
  describe("RU", () => {
    forEach(ruTestCases, (testCase, key) => {
      it(`RU case ${key}`, () => {
        expect(getMonthLoc(testCase.params)).toBe(testCase.result);
      });
    });
  });

  describe("EN", () => {
    forEach(enTestCases, (testCase, key) => {
      it(`EN case ${key}`, () => {
        expect(getMonthLoc(testCase.params)).toBe(testCase.result);
      });
    });
  });
});

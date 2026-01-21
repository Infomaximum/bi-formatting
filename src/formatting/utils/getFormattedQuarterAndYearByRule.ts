import { ELanguages, Localization } from "@infomaximum/localization";
import dayjs from "dayjs";
import { isString, isUndefined, lowerCase } from "lodash";
import { QUARTER } from "./Localization";
import { convertArrayQuarterRomanNumerals, momentFormattingByOurs } from "./const";

export const getFormattedQuarterAndYearByRule = (
  value: string,
  rule: string,
  language: ELanguages
) => {
  // получаем форматирование по ключам из библиотеки
  const newFormat = momentFormattingByOurs[rule];
  const newRule = isUndefined(newFormat) ? rule : newFormat;
  // с сервера приходит значение в формате YYYYQ
  const quarter = value.slice(-1);
  let formattingTemplate = "";
  let count = 0;

  for (let i = 0; i < newRule.length + 1; i++) {
    const element = newRule[i];

    if (lowerCase(element) === "q") {
      count++;
      continue;
    }

    if (count === 1 || count > 4) {
      formattingTemplate += quarter;
    } else if (count === 2) {
      formattingTemplate += `0${quarter}`;
    } else if (count === 3) {
      formattingTemplate += `[Q]${quarter}`;
    } else if (count === 4) {
      // используем именно форматирование M и Mo потому что Qo не поддерживается в этой версии dayjs
      formattingTemplate += `[${dayjs(quarter, "M").format("Mo")} ${lowerCase(
        Localization.getLocalizedTextSafe(language, QUARTER)
      )}]`;
    }

    if (element === "R") {
      formattingTemplate += convertArrayQuarterRomanNumerals[Number(quarter)];
    } else {
      formattingTemplate += isString(element) ? element : "";
    }

    count = 0;
  }

  return dayjs(value, "YYYYQ").format(formattingTemplate);
};

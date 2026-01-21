import { ELanguages, Localization } from "@infomaximum/localization";
import { monthsWithLoc, shortMonthsWithLoc } from "./const";
import { identity } from "lodash";

/** Меняет в шаблоне форматирования месяц по определенным правилам */
export const getFormattingTemplateMonthFormatted = (
  numberOfMonth: number,
  formattingTemplate: string,
  language: ELanguages,
  formatter: (value: string) => string = identity
) => {
  let formattingTemplateMonthFormatted = "";
  let count = 0;

  for (let i = 0; i <= formattingTemplate.length; i++) {
    const element = formattingTemplate[i];

    if (element === "M") {
      count++;
      continue;
    }

    if (count > 0) {
      if (count === 1) {
        formattingTemplateMonthFormatted += "M";
      } else if (count === 2) {
        formattingTemplateMonthFormatted += "MM";
      } else if (count === 3) {
        const month = shortMonthsWithLoc[numberOfMonth - 1];
        formattingTemplateMonthFormatted += `[${formatter(
          month ? Localization.getLocalizedTextSafe(language, month.loc) : String(numberOfMonth)
        )}]`;
      } else if (count === 4) {
        const month = monthsWithLoc[numberOfMonth - 1];
        formattingTemplateMonthFormatted += `[${formatter(
          month ? Localization.getLocalizedTextSafe(language, month.loc) : String(numberOfMonth)
        )}]`;
      }

      count = 0;
    }

    if (typeof element === "string") {
      formattingTemplateMonthFormatted += element;
    }
  }

  return formattingTemplateMonthFormatted;
};

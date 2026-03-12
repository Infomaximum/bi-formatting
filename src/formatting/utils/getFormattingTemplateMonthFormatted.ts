import { ELanguages } from "@infomaximum/localization";
import { identity } from "lodash";
import { getMonthLoc } from "./getMonthLoc";

/** Меняет в шаблоне форматирования месяц по определенным правилам */
export const getFormattingTemplateMonthFormatted = (
  numberOfMonth: number,
  formattingTemplate: string,
  language: ELanguages,
  formatter: (value: string) => string = identity
) => {
  let formattingTemplateMonthFormatted = "";
  /** количество букв M в шаблоне */
  let count = 0;
  /**
   * использовать родительный падеж.
   * должен быть true когда перед месяцем стоят дни
   */
  let genitive = false;
  const template = formattingTemplate.trim();

  for (let i = 0; i <= template.length; i++) {
    const element = template[i];

    if (element === "D" && count === 0) {
      genitive = true;
    } else if (element === "M") {
      count++;
      continue;
    } else if (element !== " " && count === 0) {
      genitive = false;
    }

    if (count > 0) {
      if (count === 1) {
        formattingTemplateMonthFormatted += "M";
      } else if (count === 2) {
        formattingTemplateMonthFormatted += "MM";
      } else if (count === 3) {
        formattingTemplateMonthFormatted += `[${formatter(getMonthLoc({ language, numberOfMonth, lengthFormat: "short" }))}]`;
      } else if (count === 4) {
        formattingTemplateMonthFormatted += `[${formatter(
          getMonthLoc({
            language,
            numberOfMonth,
            lengthFormat: "long",
            genitive,
          })
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

import { ELanguages } from "@infomaximum/localization";
import { EFormattingPresets } from "./const";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { getMonthLoc } from "./getMonthLoc";

/**
 * Форматирует месяц, согласно переданному правилу
 * @param {number} - Месяц в числовом формате, который надо отформатировать
 * @param {string} - Правило, по которому должно быть произведено форматирование
 * @returns {string} - Отформатированный месяц
 */
export const getFormattedMonthByRule = (
  value: number,
  rule: TNullable<string>,
  language: ELanguages
): string => {
  if (rule === EFormattingPresets.MMMM) {
    return getMonthLoc({ language, numberOfMonth: value, lengthFormat: "long" });
  }

  if (rule === EFormattingPresets.MMM) {
    return getMonthLoc({ language, numberOfMonth: value, lengthFormat: "short" });
  }

  if (rule === EFormattingPresets.MM) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  return String(value);
};

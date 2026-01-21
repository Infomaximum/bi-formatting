import { ELanguages, Localization } from "@infomaximum/localization";
import { EFormattingPresets, monthsWithLoc, shortMonthsWithLoc } from "./const";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";

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
    const month = monthsWithLoc[value - 1];

    if (month) {
      return Localization.getLocalizedTextSafe(language, month.loc);
    }
  }

  if (rule === EFormattingPresets.MMM) {
    const shortMonth = shortMonthsWithLoc[value - 1];

    if (shortMonth) {
      return Localization.getLocalizedTextSafe(language, shortMonth.loc);
    }
  }

  if (rule === EFormattingPresets.MM) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  return String(value);
};

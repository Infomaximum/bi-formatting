import { ELanguages, Localization } from "@infomaximum/localization";
import { EFormattingPresets, shortWeekDaysWithLoc, weekDaysWithLoc } from "./const";
import { AUTO } from "./Localization";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";

/**
 * Форматирует день недели, согласно переданному правилу
 * @param {number} - День недели в числовом формате, который надо отформатировать
 * @param {string} - Правило, по которому должно быть произведено форматирование
 * @returns {string} - Отформатированный день недели
 */
export const getFormattedDayOfWeekByRule = (
  value: number,
  rule: TNullable<string>,
  language: ELanguages
): string => {
  let result = "";

  if (rule === EFormattingPresets.AUTO) {
    result = Localization.getLocalizedTextSafe(language, AUTO) as string;
  }

  if (rule === EFormattingPresets.DDDD) {
    const weekDay = weekDaysWithLoc[value - 1];

    if (weekDay) {
      result = Localization.getLocalizedTextSafe(language, weekDay.loc) as string;
    }
  }

  if (rule === EFormattingPresets.DD) {
    const shortWeekDay = shortWeekDaysWithLoc[value - 1];

    if (shortWeekDay) {
      result = Localization.getLocalizedTextSafe(language, shortWeekDay.loc) as string;
    }
  }

  if (rule === EFormattingPresets.D) {
    result = `${value}`;
  }

  return result;
};

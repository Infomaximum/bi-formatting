import type { ELanguages } from "@infomaximum/localization";
import dayjs from "dayjs";

/**
 * Форматирует длительность, согласно переданному правилу
 * @param {number} - Число, которое надо отформатировать
 * @param {string} - Правило, по которому должно быть произведено форматирование
 * @returns {string} - Отформатированный час
 */
export const getFormattedHourByRule = (
  value: number,
  formatTemplate: string,
  loc: ELanguages
): string => {
  return dayjs().hour(value).locale(loc).format(formatTemplate);
};

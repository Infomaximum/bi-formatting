import type { ELanguages } from "@infomaximum/localization";
import { getFormattingTemplateMonthFormatted } from "./getFormattingTemplateMonthFormatted";
import type { Dayjs } from "dayjs";
import { lowerCase } from "lodash";

/**
 * Форматирует дату и время, согласно переданному правилу средствами dayjs
 * @param {dayjs} - День недели в числовом формате, который надо отформатировать
 * @param {string} - Правило, по которому должно быть произведено форматирование
 * @returns {string} - Отформатированная и локализованная средствами dayjs строка
 */
export const getFormattedDateTimeByTemplate = (
  dateTime: Dayjs,
  template: string,
  language: ELanguages
): string => {
  return dateTime.format(
    getFormattingTemplateMonthFormatted(dateTime.month() + 1, template, language, lowerCase)
  );
};

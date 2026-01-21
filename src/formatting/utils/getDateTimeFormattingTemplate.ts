import { isEmpty } from "lodash";

/**
 * Получает шаблон и отдает его. Пока никак не изменяет исходный шаблон, добавлена на будущее
 * @param {string} - исходный шаблон форматирования
 * @returns {string} - отредактированный шаблон форматирования
 */
export const getDateTimeFormattingTemplate = (formatTemplate: string): string | null => {
  return isEmpty(formatTemplate) ? null : formatTemplate;
};

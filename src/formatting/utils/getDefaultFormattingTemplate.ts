import { EFormatTypes, EFormattingPresets } from "./const";

/**
 * Возвращает шаблон форматирования по умолчанию
 * @param format - Формат, для которого возвращается шаблон по умолчанию
 */
export const getDefaultFormattingTemplate = (format: EFormatTypes): string => {
  switch (format) {
    case EFormatTypes.DURATION:
      return EFormattingPresets["hh:mm:ss"];
    case EFormatTypes.DATE:
      return EFormattingPresets["DD.MM.YYYY"];
    case EFormatTypes.DATETIME:
      return EFormattingPresets["DD.MM.YYYY, HH:mm:ss"];
    case EFormatTypes.MONTH:
      return EFormattingPresets["MMM"];
    case EFormatTypes.DAY_OF_WEEK:
      return EFormattingPresets["DD"];
    case EFormatTypes.MONTH_YEAR:
      return EFormattingPresets["MM.YYYY"];
    case EFormatTypes.QUARTER:
      return EFormattingPresets["[Q]q"];
    case EFormatTypes.QUARTER_YEAR:
      return EFormattingPresets["[Q]q[-]YYYY"];
    default:
      return "";
  }
};

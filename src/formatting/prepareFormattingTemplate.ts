import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { EFormattingPresets, EFormatTypes } from "./utils/const";
import { getDefaultFormattingTemplate } from "./utils/getDefaultFormattingTemplate";

export const prepareFormattingTemplate = (
  format: TNullable<EFormatTypes>,
  formattingValue: TNullable<string>
) => {
  // Обработка AUTO-форматирования для различных типов
  if (formattingValue === EFormattingPresets.AUTO) {
    switch (format) {
      case EFormatTypes.HOUR:
        return EFormattingPresets.HH;
      case EFormatTypes.NUMBER:
        return EFormattingPresets.k;
      case EFormatTypes.PERCENT:
        return EFormattingPresets["x[%]"];
      case EFormatTypes.DATE:
      case EFormatTypes.DATETIME:
      case EFormatTypes.MONTH:
      case EFormatTypes.DAY_OF_WEEK:
      case EFormatTypes.QUARTER:
      case EFormatTypes.QUARTER_YEAR:
      case EFormatTypes.MONTH_YEAR:
        return getDefaultFormattingTemplate(format);
      case EFormatTypes.DURATION:
      default:
        return formattingValue;
    }
  }

  // Специальные преобразования для DURATION
  if (format === EFormatTypes.DURATION) {
    if (formattingValue === EFormattingPresets.d) {
      return EFormattingPresets.dk;
    }

    if (formattingValue === EFormattingPresets.h) {
      return EFormattingPresets.hk;
    }
  }

  // Для остальных случаев возвращаем полученное форматирование
  return formattingValue;
};

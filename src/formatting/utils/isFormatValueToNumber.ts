import { EFormatTypes } from "./const";

/**
 * Проверяет тип на форматирование в число
 * @param type - тип
 * @returns {boolean}
 */
export const isFormatValueToNumber = (type?: EFormatTypes) => {
  switch (type) {
    case EFormatTypes.DATE:
      return false;
    case EFormatTypes.DATETIME:
      return false;
    case EFormatTypes.STRING:
      return false;
    case EFormatTypes.MONTH_YEAR:
      return false;
    case EFormatTypes.BOOLEAN:
      return false;

    default:
      return true;
  }
};

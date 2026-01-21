import { isNumber, trim } from "lodash";

/**
 * Проверяет значение на число
 * @param {any} value - значение
 * @returns {boolean}
 */
export const isNumberValue = (value: any): boolean => {
  const numberValue = Number(value);

  if (trim(value as string) !== "" && isNumber(numberValue)) {
    return true;
  }

  return false;
};

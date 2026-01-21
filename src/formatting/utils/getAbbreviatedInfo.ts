import type Decimal from "decimal.js";
import type { TAbbreviatedInfo } from "../types";

/**
 * Возвращает объект с информацией для формирования короткой записи числа
 * @param {number} inputValue - Не форматированное число
 * @param {Omit<TAbbreviatedInfo, "inputValue" | "isModified">} abbreviatedParts - Части
 * форматированного числа (число и постфикс)
 * @returns {TAbbreviatedInfo} - Возвращаем информацию о модификациях и форматировании
 */
export const getAbbreviatedInfo = (
  inputValue: Decimal,
  abbreviatedParts: Omit<TAbbreviatedInfo, "inputValue" | "isModified"> | null
): TAbbreviatedInfo => {
  /** Дефолтный объект, если abbreviatedParts === null */
  const defaultAbbreviatedParts: Omit<TAbbreviatedInfo, "inputValue" | "isModified"> = {
    modifiedValue: inputValue,
    ending: "",
  };
  const { modifiedValue, ending } = abbreviatedParts ? abbreviatedParts : defaultAbbreviatedParts;

  const isModified = inputValue.toString() !== `${modifiedValue}${ending}`;

  return {
    inputValue,
    isModified,
    modifiedValue,
    ending,
  };
};

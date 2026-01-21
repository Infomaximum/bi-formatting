import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { getExponential } from "./getExponential";
import { isEmpty } from "lodash";
import { EDepthSymbols } from "./const";
import type { TAbbreviatedInfo, TShortFormOfNumberSettings } from "../types";
import type Decimal from "decimal.js";
import { getShortFormOfNumber } from "./getShortFormOfNumber";
import { getAbbreviatedInfo } from "./getAbbreviatedInfo";

/**
 * Возвращает короткую форму записи числа
 * @param {number} inputValue - Число, которое надо отформатировать
 * @param {number} guaranteedSymbolsAfterDot - Обязательное кол-во точек после запятой
 * @returns {TAbbreviatedInfo} - Возвращаем информацию о модификациях и форматировании
 */
export const getAbbreviatedNumber = (
  inputValue: Decimal,
  guaranteedSymbolsAfterDot: number = 0
): TAbbreviatedInfo => {
  /** Отрицательное ли число */
  const isNegativeInputNumber = inputValue.lessThan(0);
  /** Math.abs(исходное число) */
  const positiveNumber = inputValue.abs();
  /** Целая часть числа, т.е. до точки */
  const intPart = positiveNumber.trunc();
  /** Кол-во значимых разрядов */
  const significantDigits = 3;
  /** Шаг экспоненциального представления числа. Например: 10^3 | 10^6 | 10^9 и тд. */
  const depthStep = 3;

  if (intPart.greaterThanOrEqualTo(1)) {
    let settings: TShortFormOfNumberSettings = {
      isNegativeInputNumber,
      value: positiveNumber,
      significantDigits,
      guaranteedSymbolsAfterDot,
      depth: 1,
      postfix: EDepthSymbols.none,
    };

    switch (true) {
      case intPart.lessThan(10 ** 3):
        break;
      case intPart.lessThan(10 ** 6):
        settings = { ...settings, depth: 10 ** 3, postfix: EDepthSymbols.k };
        break;
      case intPart.lessThan(10 ** 9):
        settings = { ...settings, depth: 10 ** 6, postfix: EDepthSymbols.M };
        break;
      case intPart.lessThan(10 ** 12):
        settings = { ...settings, depth: 10 ** 9, postfix: EDepthSymbols.B };
        break;
      case intPart.lessThan(10 ** 15):
        settings = { ...settings, depth: 10 ** 12, postfix: EDepthSymbols.T };
        break;
      case intPart.lessThan(10 ** 18):
        settings = { ...settings, depth: 10 ** 15, postfix: EDepthSymbols.P };
        break;
      case intPart.lessThan(10 ** 21):
        settings = { ...settings, depth: 10 ** 18, postfix: EDepthSymbols.E };
        break;
      case intPart.lessThan(10 ** 24):
        settings = { ...settings, depth: 10 ** 21, postfix: EDepthSymbols.Z };
        break;
      case intPart.lessThan(10 ** 27):
        settings = { ...settings, depth: 10 ** 24, postfix: EDepthSymbols.Y };
        break;
      default:
        return getAbbreviatedInfo(inputValue, null);
    }

    const abbreviatedParts = getShortFormOfNumber(settings);

    return getAbbreviatedInfo(inputValue, abbreviatedParts);
  } else {
    const isExponential = /e/g.test(positiveNumber.toString());
    let amountOfZeroAfterDot: number = 0;

    if (isExponential) {
      amountOfZeroAfterDot = Number(positiveNumber.toString().split("e-")[1]);
    } else {
      const symbolsAfterDot = positiveNumber.toString().split(".")[1] ?? "";

      if (isEmpty(symbolsAfterDot)) {
        return getAbbreviatedInfo(inputValue, null);
      }

      const amountOfSymbolsAfterDot = symbolsAfterDot.length;

      if (amountOfSymbolsAfterDot < significantDigits) {
        return getAbbreviatedInfo(inputValue, null);
      }

      const matchSymbolsAfterDot: TNullable<RegExpMatchArray> = symbolsAfterDot.match(/\b0+\B/);

      if (matchSymbolsAfterDot) {
        // с помощью "...length + 1" добавляем "0" который идет перед точкой
        amountOfZeroAfterDot = (matchSymbolsAfterDot[0]?.length ?? 0) + 1;
      }
    }

    const abbreviatedParts = getExponential({
      isNegativeInputNumber,
      value: positiveNumber,
      significantDigits,
      depthStep,
      amountOfZeroAfterDot,
      guaranteedSymbolsAfterDot,
    });

    return getAbbreviatedInfo(inputValue, abbreviatedParts);
  }
};

import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import Decimal from "decimal.js";
import type { TAbbreviatedInfo, TShortFormOfNumberSettings } from "../types";
import { EDepthSymbols } from "./const";

/**
 * Возвращает объект с частями для представления числа в короткой форме.
 * @param {TShortFormOfNumberSettings} TShortFormOfNumberSettings - Объект с изначальными параметрами.
 * @returns {Omit<TAbbreviatedInfo, "inputValue" | "isModified"> | null} - Возвращает объект с модифицированным числом
 * и постфиксом
 */
export const getShortFormOfNumber = ({
  isNegativeInputNumber,
  value,
  depth,
  postfix = EDepthSymbols.none,
  significantDigits,
  guaranteedSymbolsAfterDot,
}: TShortFormOfNumberSettings): Omit<TAbbreviatedInfo, "inputValue" | "isModified"> | null => {
  let intPart = value.div(depth).trunc();

  if (intPart.lessThan(1)) {
    return null;
  }

  let decimalPart: TNullable<string> = null;
  const lengthForDecimalPartWithoutGuaranteed = significantDigits - intPart.toString().length;
  const lengthForDecimalPart = Math.max(
    lengthForDecimalPartWithoutGuaranteed,
    guaranteedSymbolsAfterDot
  );

  if (lengthForDecimalPart) {
    decimalPart = value.minus(intPart.mul(depth)).div(depth).toFixed(lengthForDecimalPart);

    if (Number(decimalPart) === 1) {
      intPart = intPart.plus(new Decimal(decimalPart));
      decimalPart = "0";
    } else {
      decimalPart = (decimalPart.split(".")[1] || "0").replace(/\B0+\b/, "");
    }
  }

  const isDecimalPartZero = Number(decimalPart) === 0 || decimalPart === null;
  const afterDotPart = !isDecimalPartZero ? `.${decimalPart}` : "";
  const singManipulator = isNegativeInputNumber ? -1 : 1;

  return {
    modifiedValue: new Decimal(`${intPart}${afterDotPart}`).mul(singManipulator),
    ending: postfix,
  };
};

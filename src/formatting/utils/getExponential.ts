import Decimal from "decimal.js";
import type { TAbbreviatedInfo, TExponentialFromOfNumberSetting } from "../types";

/**
 * Возвращает объект с частями для представления числа в короткой форме.
 * @param {TExponentialFromOfNumberSetting} TExponentialFromOfNumberSetting - Объект с изначальными параметрами.
 * @returns {Omit<TAbbreviatedInfo, "inputValue" | "isModified">} - Возвращает объект с модифицированным числом
 */
export const getExponential = ({
  isNegativeInputNumber,
  value,
  significantDigits,
  depthStep,
  amountOfZeroAfterDot,
  guaranteedSymbolsAfterDot,
}: TExponentialFromOfNumberSetting): Omit<TAbbreviatedInfo, "inputValue" | "isModified"> => {
  /** Глубина, т.е. на сколько мы умножим value. Должна быть ближайшим кратным 3-м числом,
   * которое больше amountOfZeroAfterDot */
  const depth =
    amountOfZeroAfterDot % 3 !== 0
      ? (Math.trunc(amountOfZeroAfterDot / depthStep) + 1) * depthStep
      : amountOfZeroAfterDot;

  const spaceForDecimal = Math.max(
    significantDigits - (depth - amountOfZeroAfterDot),
    guaranteedSymbolsAfterDot
  );
  const exponential = new Decimal(value.mul(10 ** depth).toFixed(spaceForDecimal));
  let intPart = exponential.trunc();
  let decimalPart = null;

  if (spaceForDecimal) {
    decimalPart = exponential.minus(intPart).toFixed(spaceForDecimal);

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
    ending: depth === 0 ? "" : `e-${depth}`,
  };
};

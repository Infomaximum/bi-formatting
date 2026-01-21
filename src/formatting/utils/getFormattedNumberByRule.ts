import Decimal from "decimal.js";
import { getLocalizedMagnitude } from "./getLocalizedMagnitude";
import { getAbbreviatedNumber } from "./getAbbreviatedNumber";
import { ERuleTypes } from "./const";
import type { ELanguages } from "@infomaximum/localization";
import type { TNumberFormattingRule } from "../types";

/**
 * Форматирует число, согласно переданному правилу
 * @param {number} - Число, которое надо отформатировать
 * @param {TNumberFormattingRule} - Правило, по которому должно быть произведено форматирование
 * @returns {string} - Отформатированное число
 */
export const getFormattedNumberByRule = (
  value: Decimal,
  { rule, ruleType, configuration }: TNumberFormattingRule,
  language: ELanguages
): string => {
  if (!configuration || ruleType === ERuleTypes.STATIC) {
    return rule;
  }

  const abbreviatedRes = configuration.shouldBeAbbreviated
    ? getAbbreviatedNumber(value, configuration.symbolsAfterDot)
    : null;

  const actualValue = abbreviatedRes
    ? abbreviatedRes.isModified
      ? abbreviatedRes.modifiedValue
      : abbreviatedRes.inputValue
    : value;

  const ending = abbreviatedRes?.ending ?? "";

  const isNegative = actualValue.lessThan(0);
  // если мы сокращали число и у него больше число символов после точки, чем в конфигурации,
  // то берем его. Тк в конфигурации мы можем указать только минимум обязательных
  // символов которые идут после запятой
  const amountSymbolsAfterDot = abbreviatedRes
    ? Math.max(
        abbreviatedRes?.modifiedValue?.toString().split(".")?.[1]?.length || 0,
        configuration.symbolsAfterDot
      )
    : configuration.symbolsAfterDot;

  const integerPath = new Decimal(actualValue.toFixed(amountSymbolsAfterDot))
    .trunc()
    .abs()
    .toString();

  // Остаток от деления на единицу
  const remainderOfTheDivision = actualValue.mod(1);

  const afterDotPathResult = amountSymbolsAfterDot
    ? `.${remainderOfTheDivision.toFixed(amountSymbolsAfterDot).split(".")[1]}`
    : "";

  const fullLength = Math.max(integerPath.length, configuration.guaranteedSymbols);

  let integerPathResult = "";
  let zeroPathResult = "";
  let i = 0;

  while (i < fullLength) {
    const separator =
      configuration.splitFrequency &&
      (fullLength - i) % configuration.splitFrequency === 0 &&
      i !== 0
        ? configuration.splitSymbol
        : "";

    if (i < fullLength - integerPath.length) {
      zeroPathResult = `${zeroPathResult}${separator}0`;
    } else {
      integerPathResult = `${integerPathResult}${separator}${
        integerPath[i - (fullLength - integerPath.length)]
      }`;
    }

    i++;
  }

  let signBeforeNumber = isNegative ? "-" : "";

  if (configuration.isPresenceOfSign && !isNegative) {
    signBeforeNumber = "+";
  }

  return `${signBeforeNumber}${zeroPathResult}${integerPathResult}${afterDotPathResult}${getLocalizedMagnitude(ending, language)}`;
};

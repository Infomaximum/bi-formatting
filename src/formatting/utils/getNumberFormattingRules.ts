import { isEmpty } from "lodash";
import { ERuleTypes } from "./const";
import type { TNumberFormattingRuleList } from "../types";

/**
 * Разбирает строку форматирования для числа на статичные и динамические правила
 * Статичные правила, это те которые в результат форматирования должны попасть как есть
 * Динамические правила, это те по которым должно быть отформатировано число
 * @param format - строка форматирования
 * @returns {TNumberFormattingRuleList | null} - Лист правил форматирования либо null если не нашлось никаких соответствий
 */
export const getNumberFormattingRules = (
  formattingTemplate: string
): TNumberFormattingRuleList | null => {
  // todo: данная регулярка ловит совпадения с необязательными символами после точки. Нужно
  // под данный функционал доработать getNumberFormattingRules.
  // Так же не очевидна работа с таким кейсом: x.#xxx
  const regExp = /([k]|[z]?[#|x]*[ |,]?[#|x]+[\.]?[#]*[x]*k?)|(\[.+?\])/gi;
  const rules: TNumberFormattingRuleList = [];

  let matches = regExp.exec(formattingTemplate);

  let i = 0;

  // на всякий случай с защитой от зацикливания
  while (matches !== null && matches[0] && i < 10) {
    const staticRule = matches[2];
    const dynamicRule = matches[1];

    if (staticRule) {
      rules.push({
        ruleType: ERuleTypes.STATIC,
        rule: staticRule.replace(/\[/g, "").replace(/\]/g, ""),
      });
    } else if (dynamicRule) {
      const isPresenceOfSign = /z/i.test(dynamicRule);
      const slittedRule = dynamicRule.trim().split(".");
      const leftSideRule = slittedRule[0] ?? "";
      const rightSideRule = slittedRule[1] ?? "";
      const ruleWithoutSplitter = leftSideRule.replace(/( )|(,)/, "");
      const indexFirstX = ruleWithoutSplitter.search(/x/i);
      const indexFirstSpace = leftSideRule.indexOf(" ");
      const indexFirstComma = leftSideRule.indexOf(",");
      const amountOfKAfterDot = /k/i.test(rightSideRule) ? 1 : 0;
      const amountOfKBeforeDot = /k/i.test(leftSideRule) ? 1 : 0;
      let splitFrequency = 0;
      let splitSymbol = "";

      if (indexFirstSpace >= 0) {
        splitSymbol = " ";
        splitFrequency = leftSideRule.length - (indexFirstSpace + 1);
      } else if (indexFirstComma >= 0) {
        splitSymbol = ",";
        splitFrequency = leftSideRule.length - (indexFirstComma + 1);
      }

      rules.push({
        ruleType: ERuleTypes.DYNAMIC,
        rule: dynamicRule,
        configuration: {
          symbolsAfterDot: slittedRule.length > 1 ? rightSideRule.length - amountOfKAfterDot : 0,
          guaranteedSymbols:
            indexFirstX < 0 ? 0 : ruleWithoutSplitter.length - indexFirstX - amountOfKBeforeDot,
          splitFrequency,
          splitSymbol,
          shouldBeAbbreviated: amountOfKAfterDot > 0 || amountOfKBeforeDot > 0,
          isPresenceOfSign,
        },
      });
    } else {
      break;
    }

    matches = regExp.exec(formattingTemplate);
    i++;
  }

  return isEmpty(rules) ? null : rules;
};

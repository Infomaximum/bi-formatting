import { forEach } from "lodash";
import { durationAutoFormattingTemplates, EFormattingPresets } from "./const";
import type { IDurationRule } from "../types";
import { calcFormattedDurationRule } from "./calcFormattedDurationRule";

/**
 * Метод возвращающий правила для форматирования длительности
 * @param formatTemplate - шаблонная строка
 * @returns {IDurationRule} - правила, внутри которой идёт подготовленный шаблон, ошибка форматирования, сегменты шаблона и массив включенных разрядов
 */
export const getFormattedDurationRules = (
  formatTemplate: string
): IDurationRule | IDurationRule[] => {
  if (formatTemplate.toUpperCase() === EFormattingPresets.AUTO) {
    const formattedRulesList: IDurationRule[] = [];
    forEach(durationAutoFormattingTemplates, (durationRule) => {
      formattedRulesList.push(
        calcFormattedDurationRule(
          durationRule.preparedTemplate ?? "hh:mm:ss",
          durationRule.upperLimit
        )
      );
    });

    return formattedRulesList;
  } else {
    return calcFormattedDurationRule(formatTemplate);
  }
};

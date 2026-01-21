import type Decimal from "decimal.js";
import type { IDurationRule } from "../types";
import { Localization, type ELanguages } from "@infomaximum/localization";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { getFormattedSegments } from "./getFormattedSegments";
import { isString } from "lodash";

/**
 * Метод на основании данных(миллисекунды, правила, локализация) сначала проверяет ошибки, если они имеются, то
 * возвращается строка, что не правильно введен шаблон, если их нет, то через метод  getFormattedSegments
 * метод получает подготовленные сегменты, после чего мы циклом проходимся по каждому сегменту и на основании его ключа
 * заменяем все совпадения в подготовленном шаблоне, пришедшем из правил.
 * @param milliseconds - общее количество мс, пришедшее с сервера
 * @param rule - правила форматирования
 * @param localization - локализация
 * @returns конечная строка, которая идет на отображение
 */
export const getFormattedDurationByRule = (
  milliseconds: Decimal,
  rule: IDurationRule,
  language: ELanguages
): string => {
  if (rule.error) {
    return Localization.getLocalizedTextSafe(language, rule.error) as string;
  }

  let result: TNullable<string> = rule.preparedTemplate;

  const preparedSegments = getFormattedSegments(rule, milliseconds.abs(), language);

  preparedSegments.forEach((segmentValue, segmentKey) => {
    if (isString(result)) {
      result = result.replace(new RegExp(segmentKey, "g"), segmentValue);
    }
  });

  const replacedResult = result?.replaceAll(/^[\s\:]+|[\s\:]+$/g, "").replaceAll(/:+/g, ":") || "-";

  if (milliseconds.isNegative()) {
    return replacedResult === "-" ? "-" : `-${replacedResult}`;
  }

  return replacedResult;
};

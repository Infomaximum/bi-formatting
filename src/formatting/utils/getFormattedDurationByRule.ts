import type Decimal from "decimal.js";
import type { IDurationRule } from "../types";
import { Localization, type ELanguages } from "@infomaximum/localization";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { getFormattedSegments } from "./getFormattedSegments";
import { isString } from "lodash";

/** Управляющий символ-разделитель плейсхолдера: его нет ни в шаблоне, ни в значениях сегментов. */
const PLACEHOLDER_BOUND = String.fromCharCode(0);

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

  // Подстановку делаем в два прохода через плейсхолдеры, чтобы значение одного
  // сегмента (например суффикс месяца "мес"/"mo") не было повреждено заменой
  // другого токена (например минут "m"). Сегменты идут по убыванию длины,
  // поэтому "MMM" заменяется раньше "M".
  const segmentEntries = [...preparedSegments.entries()];

  segmentEntries.forEach(([segmentKey], index) => {
    if (isString(result)) {
      const placeholder = PLACEHOLDER_BOUND + index + PLACEHOLDER_BOUND;
      result = result.replace(new RegExp(segmentKey, "g"), placeholder);
    }
  });

  segmentEntries.forEach(([, segmentValue], index) => {
    if (isString(result)) {
      const placeholder = PLACEHOLDER_BOUND + index + PLACEHOLDER_BOUND;
      result = result.replaceAll(placeholder, segmentValue);
    }
  });

  const replacedResult = result?.replaceAll(/^[\s\:]+|[\s\:]+$/g, "").replaceAll(/:+/g, ":") || "-";

  if (milliseconds.isNegative()) {
    return replacedResult === "-" ? "-" : `-${replacedResult}`;
  }

  return replacedResult;
};

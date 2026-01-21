import { ELanguages, Localization } from "@infomaximum/localization";
import { charDurationWithLocMap, msInsideSegment } from "./const";
import Decimal from "decimal.js";
import { forEach, toNumber } from "lodash";
import type { IDurationRule } from "../types";
import { getAbbreviatedNumber } from "./getAbbreviatedNumber";

/** Метод на основании переданных данных(правила, миллисекунды и локализации), сначала формирует объект
 * с количественными значениями для каждого разряда на основании пришедших миллисекунд. После этого мы запускаем цикл,
 * проходящий по отсортированным сегментам, пришедшим с правил и на основании каждого сегмента мы заполняем Map
 * итоговыми значениями для него.
 * @param ms - общее количество мс, пришедшее с сервера
 * @param rule - правила, по которым всё будет отформатировано
 * @param language - Используемый язык системы
 * @returns отсортированный и правильно упорядоченный Map конечных значений сегментов
 */
export const getFormattedSegments = (
  rule: IDurationRule,
  ms: Decimal,
  language: ELanguages
): Map<string, string> => {
  let finallyMilliseconds: Decimal = ms;
  /** Объект в котором хранятся высчитанные значения для существующих сегментов */
  const valuesOfExistingSegments: { [key: string]: Decimal } = {};
  const result: Map<string, string> = new Map<string, string>();
  const calculatedSegmentsValue: Map<string, Decimal | string> = new Map<string, Decimal>();

  // посчитали значения для сегментов
  forEach(rule.includedSegments, (includedSegment) => {
    const segment = msInsideSegment.get(includedSegment);

    if (segment) {
      const MathValue = finallyMilliseconds.div(segment).trunc();
      valuesOfExistingSegments[includedSegment] = MathValue;
      finallyMilliseconds = finallyMilliseconds.minus(MathValue.mul(segment));
    }
  });
  // тут мы заполняем для каждого сегмента(сокращенного и нет) его значение, только с доп расчетами
  // для сокращенных сегментов(т.е. сегментов с "k", например "hhhk")
  forEach(rule.segments, (segment) => {
    const segmentValue = valuesOfExistingSegments[segment[0] ?? ""] ?? new Decimal(0);

    if (/k/gi.test(segment)) {
      const abbreviatedRes = getAbbreviatedNumber(segmentValue);
      const abbreviatedValue = `${abbreviatedRes.modifiedValue}${abbreviatedRes.ending}`;
      calculatedSegmentsValue.set(segment, abbreviatedValue);
    } else {
      calculatedSegmentsValue.set(segment, segmentValue);
    }
  });

  forEach(rule.segments, (segment) => {
    /** Есть ли окончание "k" у сегмента */
    const shouldBeAbbreviated = /k/gi.test(segment);
    /** Есть ли окончание "n" у сегмента */
    const isOptional = /n/gi.test(segment);

    /** Высчитанное value сегмента */
    const segmentValue = calculatedSegmentsValue.get(segment);
    /** Если ли у нас окончание, если есть, то нужно поставить после него пробел когда
     * segmentLength === 3 */
    const hasEnding = shouldBeAbbreviated ? isNaN(toNumber(segmentValue)) : false;
    /** Длина сегмента с вычетом "n" и "k" */
    let segmentLength = segment.length;
    segmentLength -= isOptional ? 1 : 0;
    segmentLength -= shouldBeAbbreviated ? 1 : 0;
    const isSegmentValueDecimalType = segmentValue instanceof Decimal;

    if (segmentLength === 1) {
      result.set(
        segment,
        `${isOptional && isSegmentValueDecimalType && segmentValue.equals(0) ? "" : segmentValue}`
      );
    }

    const segmentFirstChar = segment[0] ?? "";
    const valuesOfExistingSegment = valuesOfExistingSegments[segmentFirstChar] ?? new Decimal(0);

    if (segmentLength === 2) {
      const formattedSegmentValue = `${valuesOfExistingSegment.lessThan(10) ? 0 : ""}${segmentValue}`;
      result.set(
        segment,
        isOptional && isSegmentValueDecimalType && segmentValue.equals(0)
          ? ""
          : formattedSegmentValue
      );
    }

    const durationLoc = charDurationWithLocMap.get(segmentFirstChar);

    if (durationLoc && segmentLength === 3) {
      const formattedSegmentValue = `${valuesOfExistingSegment.lessThan(10) ? 0 : ""}${segmentValue}${
        hasEnding ? " " : ""
      }${Localization.getLocalizedTextSafe(language, durationLoc)}`;

      result.set(
        segment,
        isOptional && isSegmentValueDecimalType && segmentValue.equals(0)
          ? ""
          : formattedSegmentValue
      );
    }
  });

  return result;
};

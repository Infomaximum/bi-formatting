import { isEmpty } from "lodash";
import { EFormattingPresets, EFormatTypes } from "./utils/const";
import { getDefaultFormattingTemplate } from "./utils/getDefaultFormattingTemplate";
import { getFormattedDurationRules } from "./utils/getFormattedDurationRules";
import { getDateTimeFormattingTemplate } from "./utils/getDateTimeFormattingTemplate";
import { getNumberFormattingRules } from "./utils/getNumberFormattingRules";
import type { TFormattingRuleSettings } from "./types";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";

/**
 * Формирует настройку с правилами форматирования
 * @param {EFormatTypes} - тип формата
 * @param formatTemplate {string} - шаблон форматирования, если не указан, то вернутся пустые правила
 */
export const getFormattingRuleSettings = (
  formatType: EFormatTypes,
  formatTemplate: TNullable<string>
): TFormattingRuleSettings => {
  const settings: TFormattingRuleSettings = {
    formatType,
  };

  if (
    (formatType === EFormatTypes.NUMBER || formatType === EFormatTypes.PERCENT) &&
    formatTemplate &&
    !isEmpty(formatTemplate)
  ) {
    settings.numberFormattingRules = getNumberFormattingRules(formatTemplate);
  }

  if (
    (formatType === EFormatTypes.MONTH || formatType === EFormatTypes.DAY_OF_WEEK) &&
    !isEmpty(formatTemplate)
  ) {
    settings.monthAndYearFormattingRules =
      formatTemplate === EFormattingPresets.AUTO
        ? getDefaultFormattingTemplate(formatType)
        : formatTemplate;
  }

  if (
    (formatType === EFormatTypes.DATETIME || formatType === EFormatTypes.DATE) &&
    formatTemplate &&
    !isEmpty(formatTemplate)
  ) {
    settings.dateTimeFormattingTemplate = getDateTimeFormattingTemplate(formatTemplate);
  }

  if (formatType === EFormatTypes.DURATION && formatTemplate && !isEmpty(formatTemplate)) {
    settings.durationFormattingRules = getFormattedDurationRules(formatTemplate.toLowerCase());
  }

  if (formatType === EFormatTypes.HOUR && !isEmpty(formatTemplate)) {
    settings.hourFormattingTemplate =
      formatTemplate === EFormattingPresets.AUTO ? EFormattingPresets["HH"] : formatTemplate;
  }

  if (formatType === EFormatTypes.MONTH_YEAR && !isEmpty(formatTemplate)) {
    settings.monthAndYearFormattingRules =
      formatTemplate === EFormattingPresets.AUTO
        ? getDefaultFormattingTemplate(formatType)
        : formatTemplate;
  }

  if (
    (formatType === EFormatTypes.QUARTER_YEAR || formatType === EFormatTypes.QUARTER) &&
    formatTemplate &&
    !isEmpty(formatTemplate)
  ) {
    const quarterAndYearTemplate =
      formatTemplate === EFormattingPresets.AUTO
        ? getDefaultFormattingTemplate(formatType)
        : formatTemplate;
    settings.quarterAndYearFormattingTemplate = quarterAndYearTemplate;
  }

  return settings;
};

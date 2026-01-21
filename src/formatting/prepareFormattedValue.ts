import type { ELanguages } from "@infomaximum/localization";
import type { IDurationRule, TFormattingRuleSettings } from "./types";
import { MillisecondsPerSecond, nullReplacedValue } from "@infomaximum/utility";
import { getPreparedValue } from "./utils/getPreparedValue";
import Decimal from "decimal.js";
import { isFormatValueToNumber } from "./utils/isFormatValueToNumber";
import { convertArrayQuarterRomanNumerals, EFormattingPresets, EFormatTypes } from "./utils/const";
import { forEach, isArray, isEmpty, isNil } from "lodash";
import { isNumberValue } from "./utils/isNumberValue";
import dayjs from "dayjs";
import { getDefaultFormattingTemplate } from "./utils/getDefaultFormattingTemplate";
import { getFormattedDurationByRule } from "./utils/getFormattedDurationByRule";
import { getFormattedHourByRule } from "./utils/getFormattedHourByRule";
import { getFormattedDateTimeByTemplate } from "./utils/getFormattedDateTimeByTemplate";
import { getFormattedMonthYearByTemplate } from "./utils/getFormattedMonthYearByTemplate";
import { getFormattedQuarterAndYearByRule } from "./utils/getFormattedQuarterAndYearByRule";
import { getFormattedDayOfWeekByRule } from "./utils/getFormattedDayOfWeekByRule";
import { getFormattedMonthByRule } from "./utils/getFormattedMonthByRule";
import { getFormattedNumberByRule } from "./utils/getFormattedNumberByRule";

export const prepareFormattedValue = (
  value: any,
  conf: TFormattingRuleSettings,
  language: ELanguages
): string => {
  if (value === null || value === nullReplacedValue) {
    return "-";
  }

  try {
    const formatType = conf.formatType;

    const preparedValue = getPreparedValue(value);
    const preparedValueString = preparedValue ? preparedValue.toString() : undefined;
    const isDecimalValue = preparedValue instanceof Decimal;

    if (isFormatValueToNumber(formatType)) {
      if (isNaN(Number(value))) {
        return "NaN";
      }
    }

    if (formatType === EFormatTypes.STRING) {
      return isDecimalValue ? preparedValueString : value;
    }

    if (formatType === EFormatTypes.BOOLEAN) {
      return isDecimalValue ? preparedValueString : value;
    }

    if (formatType === EFormatTypes.YEAR) {
      return Number(value) ? preparedValueString : "";
    }

    if (formatType === EFormatTypes.DAY_OF_MONTH) {
      return Number(value) ? preparedValueString : "";
    }

    if (formatType === EFormatTypes.WEEK) {
      return Number(value) ? preparedValueString : "";
    }

    if (formatType === EFormatTypes.NUMBER || formatType === EFormatTypes.PERCENT) {
      if (isEmpty(conf.numberFormattingRules)) {
        return preparedValueString;
      }

      let result = "";
      forEach(conf.numberFormattingRules, (rule) => {
        result = `${result}${getFormattedNumberByRule(formatType === EFormatTypes.PERCENT ? preparedValue.mul(100) : preparedValue, rule, language)}`;

        if (result.startsWith("$-")) {
          result = result.replace("$-", "-$");
        }
      });

      return result;
    }

    if (formatType === EFormatTypes.MONTH) {
      if (!Number(value)) {
        return "";
      }

      if (isEmpty(conf.monthAndYearFormattingRules) || !language) {
        return preparedValueString;
      }

      if (isNumberValue(value)) {
        if (preparedValue.greaterThan(0) && preparedValue.lessThanOrEqualTo(12)) {
          return getFormattedMonthByRule(preparedValue, conf.monthAndYearFormattingRules, language);
        }
      }

      return value;
    }

    if (formatType === EFormatTypes.DAY_OF_WEEK) {
      if (!Number(value)) {
        return "";
      }

      if (isEmpty(conf.monthAndYearFormattingRules) || !language) {
        return preparedValueString;
      }

      if (isNumberValue(value)) {
        const numberValue = Number(value);

        if (numberValue > 0 && numberValue <= 7) {
          return getFormattedDayOfWeekByRule(
            numberValue,
            conf.monthAndYearFormattingRules,
            language
          );
        }
      }

      return preparedValueString;
    }

    if (formatType === EFormatTypes.DATETIME || formatType === EFormatTypes.DATE) {
      if (isEmpty(value)) {
        return value;
      }

      const dateTimeValue = dayjs(value);

      if (!dateTimeValue.isValid()) {
        return "-";
      }

      if (
        !conf.dateTimeFormattingTemplate ||
        isEmpty(conf.dateTimeFormattingTemplate) ||
        conf.dateTimeFormattingTemplate === EFormattingPresets.AUTO
      ) {
        return getFormattedDateTimeByTemplate(
          dateTimeValue,
          getDefaultFormattingTemplate(conf.formatType),
          language
        );
      }

      return getFormattedDateTimeByTemplate(
        dateTimeValue,
        conf.dateTimeFormattingTemplate,
        language
      );
    }

    if (formatType === EFormatTypes.DURATION) {
      if (isEmpty(conf.durationFormattingRules)) {
        return preparedValueString;
      }

      if (conf.durationFormattingRules && isNumberValue(value)) {
        let durationRule: IDurationRule = {};

        if (isArray(conf.durationFormattingRules)) {
          forEach(conf.durationFormattingRules, (rule) => {
            if (!rule.upperLimit || preparedValue.lessThan(rule.upperLimit)) {
              durationRule = rule;

              return false;
            }
          });
        } else {
          durationRule = conf.durationFormattingRules;
        }

        return getFormattedDurationByRule(
          preparedValue.mul(MillisecondsPerSecond),
          durationRule,
          language
        );
      }

      return preparedValueString;
    }

    if (formatType === EFormatTypes.HOUR) {
      if (!Number(value) && value !== "0") {
        return "";
      }

      if (isEmpty(conf.hourFormattingTemplate)) {
        return preparedValueString;
      }

      if (conf.hourFormattingTemplate && isNumberValue(value)) {
        return getFormattedHourByRule(preparedValue, conf.hourFormattingTemplate, language);
      }

      return preparedValueString;
    }

    if (formatType === EFormatTypes.MONTH_YEAR) {
      if (!Number(value)) {
        return "";
      }

      if (isNil(conf.monthAndYearFormattingRules) || isEmpty(conf.monthAndYearFormattingRules)) {
        return getFormattedMonthYearByTemplate(
          value,
          getDefaultFormattingTemplate(formatType),
          language
        );
      }

      return getFormattedMonthYearByTemplate(value, conf.monthAndYearFormattingRules, language);
    }

    if (formatType === EFormatTypes.QUARTER || formatType === EFormatTypes.QUARTER_YEAR) {
      if (!Number(value)) {
        return "";
      }

      if (
        isEmpty(conf.quarterAndYearFormattingTemplate) ||
        isNil(conf.quarterAndYearFormattingTemplate)
      ) {
        return getFormattedQuarterAndYearByRule(
          value,
          getDefaultFormattingTemplate(formatType),
          language
        );
      }

      if (formatType === EFormatTypes.QUARTER) {
        return conf.quarterAndYearFormattingTemplate === "R"
          ? convertArrayQuarterRomanNumerals[Number(value)] ?? ""
          : `Q${value}`;
      }

      return getFormattedQuarterAndYearByRule(
        value,
        conf.quarterAndYearFormattingTemplate,
        language
      );
    }

    return "-";
  } catch (error) {
    return String(error);
  }
};

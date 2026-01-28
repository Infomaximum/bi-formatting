import type { ELanguages } from "@infomaximum/localization";
import { EFormatTypes } from "./utils/const";
import { prepareFormattedValue } from "./prepareFormattedValue";
import { prepareFormattingTemplate } from "./prepareFormattingTemplate";
import { getFormattingRuleSettings } from "./getFormattingRuleSettings";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import { isFormatType } from "./utils/isFormatType";

export const getFormattedValue = ({
  formatType,
  formatting,
  language,
  value,
}: {
  value: any;
  formatType: EFormatTypes | string;
  formatting: TNullable<string>;
  language: ELanguages;
}) => {
  if (!isFormatType(formatType)) {
    return value;
  }

  const formattingRuleSettings = getFormattingRuleSettings(
    formatType,
    prepareFormattingTemplate(formatType, formatting)
  );

  return prepareFormattedValue(value, formattingRuleSettings, language);
};

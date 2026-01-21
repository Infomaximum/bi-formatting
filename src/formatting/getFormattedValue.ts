import type { ELanguages } from "@infomaximum/localization";
import type { EFormattingPresets, EFormatTypes } from "./utils/const";
import { prepareFormattedValue } from "./prepareFormattedValue";
import { prepareFormattingTemplate } from "./prepareFormattingTemplate";
import { getFormattingRuleSettings } from "./getFormattingRuleSettings";

export const getFormattedValue = ({
  formatType,
  formatting,
  language,
  value,
}: {
  value: any;
  formatType: EFormatTypes;
  formatting: EFormattingPresets | undefined;
  language: ELanguages;
}) => {
  const formattingRuleSettings = getFormattingRuleSettings(
    formatType,
    prepareFormattingTemplate(formatType, formatting)
  );

  return prepareFormattedValue(value, formattingRuleSettings, language);
};

import type { ELanguages } from "@infomaximum/localization";
import type { EFormatTypes } from "./utils/const";
import { prepareFormattedValue } from "./prepareFormattedValue";
import { prepareFormattingTemplate } from "./prepareFormattingTemplate";
import { getFormattingRuleSettings } from "./getFormattingRuleSettings";
import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";

export const getFormattedValue = ({
  formatType,
  formatting,
  language,
  value,
}: {
  value: any;
  formatType: EFormatTypes;
  formatting: TNullable<string>;
  language: ELanguages;
}) => {
  const formattingRuleSettings = getFormattingRuleSettings(
    formatType,
    prepareFormattingTemplate(formatType, formatting)
  );

  return prepareFormattedValue(value, formattingRuleSettings, language);
};

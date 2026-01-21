import dayjs from "dayjs";
import { getFormattingTemplateMonthFormatted } from "./getFormattingTemplateMonthFormatted";
import type { ELanguages } from "@infomaximum/localization";

export const getFormattedMonthYearByTemplate = (
  value: string,
  rule: string,
  language: ELanguages
) => {
  // значение с сервера в формате YYYYMM
  const numberOfMonth = Number(value.substring(4));

  return dayjs(value, "YYYYMM").format(
    getFormattingTemplateMonthFormatted(numberOfMonth, rule, language)
  );
};

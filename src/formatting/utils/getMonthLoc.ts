import { ELanguages } from "@infomaximum/localization";

type TGetMonthLocParams = {
  language: ELanguages;
  numberOfMonth: number;
  lengthFormat: "long" | "short";
  genitive?: boolean;
};

export const getMonthLoc = ({
  language,
  numberOfMonth,
  lengthFormat,
  genitive = false,
}: TGetMonthLocParams) => {
  const monthFormat = Intl.DateTimeFormat(language, {
    day: genitive ? "numeric" : undefined,
    month: lengthFormat,
  })
    .formatToParts(new Date().setMonth(numberOfMonth - 1))
    .find((p) => p.type === "month");

  if (!monthFormat) {
    return String(numberOfMonth);
  }

  let month = monthFormat.value;

  if (language === ELanguages.ru) {
    month = month.charAt(0).toUpperCase() + month.slice(1);
  }

  if (lengthFormat === "short") {
    month = month.slice(0, 3);
  }

  return month;
};

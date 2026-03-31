import { ELanguages } from "@infomaximum/localization";

type TGetMonthLocParams = {
  language: ELanguages;
  numberOfMonth: number;
  lengthFormat: "long" | "short";
  genitive?: boolean;
};

/**
 * Создаёт дату с фиксированным первым числом для заданного месяца.
 * Intl.DateTimeFormat требует полный объект Date, чтобы вернуть название месяца —
 * самостоятельно указать только месяц API не позволяет.
 * День намеренно зафиксирован на 1-м числе: если использовать текущий день
 * (например, 31-е), то для месяцев с меньшим количеством дней произойдёт
 * переполнение и Date сдвинется на следующий месяц.
 */
const getDateForMonth = (numberOfMonth: number) => new Date(2000, numberOfMonth - 1, 1);

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
    .formatToParts(getDateForMonth(numberOfMonth))
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

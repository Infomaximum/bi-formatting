import type { TNullable } from "@infomaximum/utility/dist/utils/types/utility.types";
import type Decimal from "decimal.js";
import type { EDepthSymbols, EFormatTypes, ERuleTypes } from "./utils/const";
import type { TLocalizationDescription } from "@infomaximum/localization";

export type TAbbreviatedInfo = {
  /** Исходное число */
  inputValue: Decimal;
  /** Модифицированное число */
  modifiedValue: Decimal;
  /** Окончание для модифицированного числа */
  ending: string | null;
  /** Было ли модифицировано исходное число */
  isModified: boolean;
};

export type TShortFormOfNumberSettings = {
  /** Отрицательное ли value изначально */
  isNegativeInputNumber: boolean;
  /** Число >= 1, которое надо отформатировать */
  value: Decimal;
  /** Глубина или в каких величинах мы хотим получить результат */
  depth: number;
  /** Символ для обозначения величины */
  postfix: EDepthSymbols;
  /** Кол-во значимых разрядов */
  significantDigits: number;
  /** Кол-во обязательных символов после точки */
  guaranteedSymbolsAfterDot: number;
};

export type TExponentialFromOfNumberSetting = {
  /** Отрицательное ли value изначально */
  isNegativeInputNumber: boolean;
  /** Число < 1 которое надо отформатировать */
  value: Decimal;
  /** Кол-во значимых разрядов */
  significantDigits: number;
  /** Шаг экспоненциального представления числа. Например: 3 = 10^3 | 6 = 10^6 | 9 = 10^9 и тд. */
  depthStep: number;
  /** Кол-во нулей после точки */
  amountOfZeroAfterDot: number;
  /** Кол-во обязательных символов после точки */
  guaranteedSymbolsAfterDot: number;
};

export type TNumberRuleConfiguration = {
  /** количество отображаемых символов в дробной части */
  symbolsAfterDot: number;
  /** символ разделения разрядов */
  splitSymbol: string;
  /** через сколько знаков разделять разряд */
  splitFrequency: number;
  /** сколько гарантированных символов будет в целой части (если не хватает то заполнится нулями) */
  guaranteedSymbols: number;
  /** есть ли "k" модификатор, т.е. модификатор сокращенного форматирования */
  shouldBeAbbreviated: boolean;
  /** есть ли префикс "z" (знак перед числом) */
  isPresenceOfSign: boolean;
};

export interface IDurationRule {
  /** подготовленная строка, в которой необходимо лишь заменить разряды сегментов */
  preparedTemplate?: string;
  /** это массив сегментов шаблона */
  segments?: Array<string>;
  /** ошибка, когда шаблон форматирования введен не корректно */
  error?: TLocalizationDescription;
  /** массив разрядов сегментов, которые включены в шаблонную строку */
  includedSegments?: Array<string>;
  /** верхний лимит до которого применяется правило */
  upperLimit?: number;
}

export type TNumberFormattingRule = {
  ruleType: ERuleTypes;
  rule: string;
  configuration?: TNumberRuleConfiguration;
};

export type TNumberFormattingRuleList = TNumberFormattingRule[];

export type TFormattingRuleSettings = {
  /** Формат, для которого готовятся правила */
  formatType: EFormatTypes | string;
  /** Описание как форматировать значение с форматом = число {EFormatTypes.NUMBER} */
  numberFormattingRules?: TNullable<TNumberFormattingRuleList>;
  /** Описание как форматировать значение с форматом = месяц {EFormatTypes.MONTH} или день недели {EFormatTypes.DAY_OF_WEEK} */
  monthAndYearFormattingRules?: TNullable<string>;
  /** Описание как форматировать значение с форматом = Дата и время {EFormatTypes.DATE_TIME} */
  dateTimeFormattingTemplate?: TNullable<string>;
  /** Описание как форматировать значение с форматом = длительность {EFormatTypes.DURATION} */
  durationFormattingRules?: TNullable<IDurationRule> | TNullable<IDurationRule[]>;
  /** Описание как форматировать значение с форматом = Час {EFormatTypes.HOUR} */
  hourFormattingTemplate?: TNullable<string>;
  /** Описание как форматировать значение с форматом = Квартал и год {EFormatTypes.QUARTER_YEAR} */
  quarterAndYearFormattingTemplate?: TNullable<string>;
};

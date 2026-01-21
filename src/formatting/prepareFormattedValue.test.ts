import { nullReplacedValue } from "@infomaximum/utility";
import { Localization } from "@infomaximum/localization";
import { EFormatTypes, ERuleTypes } from "./utils/const";
import { prepareFormattedValue } from "./prepareFormattedValue";

describe("Test getFormattedValue function", () => {
  const localization = new Localization({ language: Localization.Language.ru });

  const tests = [
    { value: undefined, conf: { formatType: EFormatTypes.NUMBER }, expected: "NaN" },
    { value: NaN, conf: { formatType: EFormatTypes.NUMBER }, expected: "NaN" },
    { value: Infinity, conf: { formatType: EFormatTypes.NUMBER }, expected: "Infinity" },
    { value: 0, conf: { formatType: EFormatTypes.NUMBER }, expected: "0" },
    { value: null, conf: { formatType: EFormatTypes.STRING }, expected: "-" },
    { value: nullReplacedValue, conf: { formatType: EFormatTypes.STRING }, expected: "-" },
    {
      value: "Hello, World!",
      conf: { formatType: EFormatTypes.STRING },
      expected: "Hello, World!",
    },
    { value: "", conf: { formatType: EFormatTypes.STRING }, expected: "" },
    { value: NaN, conf: { formatType: EFormatTypes.MONTH }, expected: "NaN" },
    { value: undefined, conf: { formatType: EFormatTypes.DURATION }, expected: "NaN" },
    {
      value: 100.1,
      conf: { formatType: EFormatTypes.NUMBER, numberFormattingRules: null },
      expected: "100.1",
    },
    { value: true, conf: { formatType: EFormatTypes.BOOLEAN }, expected: true },
    { value: false, conf: { formatType: EFormatTypes.BOOLEAN }, expected: false },
    {
      value: 1,
      conf: { formatType: EFormatTypes.QUARTER, quarterAndYearFormattingTemplate: "[Q]q[-]YYYY" },
      expected: "Q1",
    },
    {
      value: 115,
      conf: { formatType: EFormatTypes.QUARTER, quarterAndYearFormattingTemplate: "[Q]q[-]YYYY" },
      expected: "Q115",
    },
    {
      value: 4,
      conf: { formatType: EFormatTypes.QUARTER, quarterAndYearFormattingTemplate: "R" },
      expected: "IV",
    },
    {
      value: 6,
      conf: { formatType: EFormatTypes.QUARTER, quarterAndYearFormattingTemplate: "R" },
      expected: "",
    },
    {
      value: "20234",
      conf: {
        formatType: EFormatTypes.QUARTER_YEAR,
      },
      expected: "Q4-2023",
    },
    {
      value: 123456789.987,
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "k",
            configuration: {
              symbolsAfterDot: 2,
              splitSymbol: ",",
              splitFrequency: 3,
              guaranteedSymbols: 1,
              shouldBeAbbreviated: true,
              isPresenceOfSign: false,
            },
          },
        ],
      },
      expected: "123.46 млн.",
    },
    {
      value: 1000,
      conf: { formatType: EFormatTypes.NUMBER, numberFormattingRules: null },
      expected: "1000",
    },
    {
      value: "1945654719959825960",
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "x",
            configuration: {
              symbolsAfterDot: 0,
              guaranteedSymbols: 1,
              splitFrequency: 0,
              splitSymbol: "",
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
        ],
      },
      expected: "1945654719959825960",
    },
    {
      value: "1945654719959825960",
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "#,##x",
            configuration: {
              symbolsAfterDot: 0,
              guaranteedSymbols: 1,
              splitFrequency: 3,
              splitSymbol: ",",
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
        ],
      },
      expected: "1,945,654,719,959,825,960",
    },
    {
      value: 19456,
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "#,##x",
            configuration: {
              symbolsAfterDot: 0,
              guaranteedSymbols: 1,
              splitFrequency: 3,
              splitSymbol: ",",
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
        ],
      },
      expected: "19,456",
    },
    {
      value: 123.456,
      conf: { formatType: EFormatTypes.NUMBER, numberFormattingRules: [] },
      expected: "123.456",
    },
    {
      value: 1000,
      conf: {
        formatType: EFormatTypes.PERCENT,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "zx.xx",
            configuration: {
              symbolsAfterDot: 2,
              guaranteedSymbols: 1,
              splitFrequency: 0,
              splitSymbol: "",
              shouldBeAbbreviated: false,
              isPresenceOfSign: true,
            },
          },
          {
            ruleType: ERuleTypes.STATIC,
            rule: "%",
          },
        ],
      },
      expected: "+100000.00%",
    },
    {
      value: 123.456,
      conf: {
        formatType: EFormatTypes.PERCENT,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "x.x",
            configuration: {
              symbolsAfterDot: 1,
              splitSymbol: "",
              splitFrequency: 0,
              guaranteedSymbols: 1,
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
          {
            ruleType: ERuleTypes.STATIC,
            rule: "%",
          },
        ],
      },
      expected: "12345.6%",
    },
    {
      value: 1234.567,
      conf: {
        formatType: EFormatTypes.PERCENT,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "x",
            configuration: {
              symbolsAfterDot: 0,
              splitSymbol: "",
              splitFrequency: 0,
              guaranteedSymbols: 1,
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
          {
            ruleType: ERuleTypes.STATIC,
            rule: "%",
          },
        ],
      },
      expected: "123457%",
    },
    {
      value: 1234.567,
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "#,##0.00",
            configuration: {
              symbolsAfterDot: 2,
              splitSymbol: ",",
              splitFrequency: 3,
              guaranteedSymbols: 1,
              shouldBeAbbreviated: false,
              isPresenceOfSign: false,
            },
          },
        ],
      },
      expected: "1,234.57",
    },
    {
      value: 100,
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            rule: "$",
            ruleType: ERuleTypes.STATIC,
          },
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "X",
            configuration: {
              guaranteedSymbols: 1,
              isPresenceOfSign: false,
              shouldBeAbbreviated: false,
              splitFrequency: 0,
              splitSymbol: "",
              symbolsAfterDot: 0,
            },
          },
        ],
      },
      expected: "$100",
    },
    {
      value: -100,
      conf: {
        formatType: EFormatTypes.NUMBER,
        numberFormattingRules: [
          {
            rule: "$",
            ruleType: ERuleTypes.STATIC,
          },
          {
            ruleType: ERuleTypes.DYNAMIC,
            rule: "X",
            configuration: {
              guaranteedSymbols: 1,
              isPresenceOfSign: false,
              shouldBeAbbreviated: false,
              splitFrequency: 0,
              splitSymbol: "",
              symbolsAfterDot: 0,
            },
          },
        ],
      },
      expected: "-$100",
    },
    { value: 2025, conf: { formatType: EFormatTypes.YEAR }, expected: "2025" },
    { value: null, conf: { formatType: EFormatTypes.YEAR }, expected: "-" },
    {
      value: 5,
      conf: { formatType: EFormatTypes.MONTH, monthAndYearFormattingRules: "MMMM" },
      expected: "Май",
    },
    {
      value: 9,
      conf: { formatType: EFormatTypes.MONTH, monthAndYearFormattingRules: "MMMM" },
      expected: "Сентябрь",
    },
    {
      value: 9,
      conf: { formatType: EFormatTypes.MONTH, monthAndYearFormattingRules: "MMM" },
      expected: "Сен",
    },
    {
      value: 13,
      conf: { formatType: EFormatTypes.MONTH, monthAndYearFormattingRules: "MMMM" },
      expected: 13,
    },
    {
      value: 0,
      conf: { formatType: EFormatTypes.MONTH, monthAndYearFormattingRules: "MMMM" },
      expected: "",
    },
    {
      value: 0,
      conf: {
        formatType: EFormatTypes.HOUR,
        hourFormattingTemplate: "HH:mm",
      },
      expected: "",
    },
    {
      value: 5,
      conf: {
        formatType: EFormatTypes.HOUR,
        hourFormattingTemplate: "HH",
      },
      expected: "05",
    },
    {
      value: 13,
      conf: {
        formatType: EFormatTypes.HOUR,
        hourFormattingTemplate: "hh A",
      },
      expected: "01 дня",
    },
    {
      value: 23,
      conf: {
        formatType: EFormatTypes.HOUR,
        hourFormattingTemplate: "hh A",
      },
      expected: "11 вечера",
    },
    {
      value: 7,
      conf: {
        formatType: EFormatTypes.WEEK,
      },
      expected: "7",
    },
    {
      value: 3,
      conf: { formatType: EFormatTypes.DAY_OF_WEEK, monthAndYearFormattingRules: "DDDD" },
      expected: "Среда",
    },
    {
      value: 111,
      conf: { formatType: EFormatTypes.DAY_OF_WEEK, monthAndYearFormattingRules: "DDDD" },
      expected: "111",
    },
    {
      value: 15,
      conf: {
        formatType: EFormatTypes.DAY_OF_MONTH,
      },
      expected: "15",
    },
    {
      value: "202406",
      conf: { formatType: EFormatTypes.MONTH_YEAR },
      expected: "06.2024",
    },
    {
      value: "2024-01-01",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "01.01.2024",
    },
    {
      value: "2024-02-01",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD-MM-YYYY",
      },
      expected: "01-02-2024",
    },
    {
      value: "2024-12-31",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "YYYY/MM/DD",
      },
      expected: "2024/12/31",
    },
    {
      value: "2024-05-15T13:45:30",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY, HH:mm:ss",
      },
      expected: "15.05.2024, 13:45:30",
    },
    {
      value: "2100-01-01",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "01.01.2100",
    },
    {
      value: "2050-12-31T23:59:59",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "YYYY/MM/DD HH:mm:ss",
      },
      expected: "2050/12/31 23:59:59",
    },
    {
      value: "invalid date",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY, HH:mm:ss",
      },
      expected: "-",
    },
    {
      value: "2024-02-30",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "01.03.2024",
    },
    {
      value: "2024-01-32",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "01.02.2024",
    },
    {
      value: "2024-04-31",
      conf: {
        formatType: EFormatTypes.DATETIME,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "01.05.2024",
    },
    {
      value: "2024-03-01",
      conf: {
        formatType: EFormatTypes.DATE,
        dateTimeFormattingTemplate: "YYYY-MM-DD",
      },
      expected: "2024-03-01",
    },
    {
      value: "2024-03-15",
      conf: {
        formatType: EFormatTypes.DATE,
        dateTimeFormattingTemplate: "DD/MM/YYYY",
      },
      expected: "15/03/2024",
    },
    {
      value: "2024-06-30",
      conf: {
        formatType: EFormatTypes.DATE,
        dateTimeFormattingTemplate: "dddd, D MMMM YYYY",
      },
      expected: "воскресенье, 30 июнь 2024",
    },
    {
      value: null,
      conf: {
        formatType: EFormatTypes.DATE,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "-",
    },
    {
      value: "",
      conf: {
        formatType: EFormatTypes.DATE,
        dateTimeFormattingTemplate: "DD.MM.YYYY",
      },
      expected: "",
    },
    {
      value: 3600,
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "hh:mm:ss",
            includedSegments: ["h", "m", "s"],
            segments: ["hh", "mm", "ss"],
          },
        ],
      },
      expected: "01:00:00",
    },
    {
      value: 7629, // 2 * 60 * 60 + 7 * 60 + 9
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "hh:mm:ss",
            includedSegments: ["h", "m", "s"],
            segments: ["hh", "mm", "ss"],
          },
        ],
      },
      expected: "02:07:09",
    },
    {
      value: 7629,
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "hhh:mmm:sss",
            includedSegments: ["h", "m", "s"],
            segments: ["hh", "mm", "ss"],
          },
        ],
      },
      expected: "02h:07m:09s",
    },
    {
      value: 7629,
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "hh:mm",
            includedSegments: ["h", "m"],
            segments: ["hh", "mm"],
          },
        ],
      },
      expected: "02:07",
    },
    {
      value: 7629,
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "ss",
            includedSegments: ["s"],
            segments: ["ss"],
          },
        ],
      },
      expected: "7629",
    },
    {
      value: 7629,
      conf: {
        formatType: EFormatTypes.DURATION,
        durationFormattingRules: [
          {
            preparedTemplate: "sss",
            includedSegments: ["s"],
            segments: ["ss"],
          },
        ],
      },
      expected: "7629s",
    },
    // Приведение к унифицированному строковому представлению при отсутствии явного форматирования
    { value: "0.0000001", conf: { formatType: EFormatTypes.NUMBER }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.NUMBER }, expected: "1e-7" },

    { value: "0.0000001", conf: { formatType: EFormatTypes.PERCENT }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.PERCENT }, expected: "1e-7" },

    { value: "0.0000001", conf: { formatType: EFormatTypes.DURATION }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.DURATION }, expected: "1e-7" },

    { value: "0.0000001", conf: { formatType: EFormatTypes.MONTH }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.MONTH }, expected: "1e-7" },

    { value: "0.0000001", conf: { formatType: EFormatTypes.DAY_OF_WEEK }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.DAY_OF_WEEK }, expected: "1e-7" },

    { value: "0.0000001", conf: { formatType: EFormatTypes.HOUR }, expected: "1e-7" },
    { value: "1e-7", conf: { formatType: EFormatTypes.HOUR }, expected: "1e-7" },
  ];

  tests.forEach(({ value, conf, expected }) => {
    it(`Входящие значения: ${JSON.stringify(value)}, Конфигурация: ${JSON.stringify(conf)}, Ожидаемый результат: ${expected}`, () => {
      const result = prepareFormattedValue(value, conf, localization.getLanguage());
      expect(result).toEqual(expected);
    });
  });
});

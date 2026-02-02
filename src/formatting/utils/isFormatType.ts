import { EFormatTypes } from "./const";

const formats = new Set(Object.values(EFormatTypes));

export function isFormatType(value: string | undefined): value is EFormatTypes {
  return !!value && formats.has(value as EFormatTypes);
}

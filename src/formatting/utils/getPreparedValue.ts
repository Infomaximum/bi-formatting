import { Decimal } from "decimal.js";

export const getPreparedValue = (value: any) => {
  try {
    return new Decimal(value);
  } catch {
    return value;
  }
};

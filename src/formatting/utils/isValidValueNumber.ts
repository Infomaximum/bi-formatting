/**
 * Проверяет число нa NaN и Infinity
 * @param value - число
 * @returns {boolean}
 */
export const isValidValueNumber = (value: number): boolean => {
  if (isNaN(value) || !isFinite(value)) {
    return false;
  }

  return true;
};

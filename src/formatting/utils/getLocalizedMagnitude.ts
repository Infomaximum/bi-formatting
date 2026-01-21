import { ELanguages, Localization } from "@infomaximum/localization";
import { magnitudeLocMap } from "./const";

export const getLocalizedMagnitude = (postfix: string, language: ELanguages) => {
  const localization = magnitudeLocMap.get(postfix);

  return localization ? Localization.getLocalizedTextSafe(language, localization) : postfix;
};

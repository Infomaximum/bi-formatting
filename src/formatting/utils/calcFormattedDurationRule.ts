import { forEach } from "lodash";
import { FORMATTING_IS_INCORRECT } from "./Localization";
import type { IDurationRule } from "../types";

export const calcFormattedDurationRule = (
  formatTemplate: string,
  upperLimit?: number
): IDurationRule => {
  const regExp = /^(h{1,3}|d{1,3}|s{1,3}|m{1,3})([n|N](?![n|N])|[k|K](?![k|K])){0,2}$/;

  const segmentList = formatTemplate.split(":");
  const result: IDurationRule = { preparedTemplate: "", upperLimit: upperLimit };
  const includedSegments: Array<string> = [];
  const segments: Array<string> = [];

  forEach(segmentList, (segment, index) => {
    if (!regExp.test(segment)) {
      result["error"] = FORMATTING_IS_INCORRECT;

      return false;
    }

    let segmentLength = segment.length;
    segmentLength -= /n/gi.test(segment) ? 1 : 0;
    segmentLength -= /k/gi.test(segment) ? 1 : 0;

    const segmentFirstChar = segment[0] ?? "";

    if (!includedSegments.includes(segmentFirstChar)) {
      includedSegments.push(segmentFirstChar);
    }

    if (segmentLength === 3) {
      result["preparedTemplate"] += index === segmentList.length - 1 ? `${segment}` : `${segment} `;
    } else {
      result["preparedTemplate"] += index === segmentList.length - 1 ? `${segment}` : `${segment}:`;
    }

    segments.push(segment);
  });

  result.includedSegments = includedSegments.sort();
  result["segments"] = segments.sort((a, b) => {
    return b.length - a.length;
  });

  return result;
};

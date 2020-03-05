import { JSONErrorType, JSONErrorBase } from "../../commons/types/error.types";

export type StringJSONError = 
  | StringLongerThanAllowedJSONError
  | StringShorterThanAllowedJSONError
  | StringIsNotInTheAllowedValuesJSONError;

export class StringLongerThanAllowedJSONError extends JSONErrorBase {
  constructor(
    name: string,
    value: string,
    path: string[],
    length: number,
    maxLengthAllowed: number,
  ) {
    super(
      name,
      value,
      JSONErrorType.StringLongerThanAllowed,
      path,
      `String is longer than allowed (allowed=${maxLengthAllowed}, received=${length})`
    );
  }
}

export class StringShorterThanAllowedJSONError extends JSONErrorBase {
  constructor(
    name: string,
    value: any,
    path: string[],
    length: number,
    minLengthAllowed: number,
  ) {
    super(
      name,
      value,
      JSONErrorType.StringShorterThanAllowed,
      path,
      `String is shorter than allowed (allowed=${minLengthAllowed}, received=${length})`
    );
  }
}

export class StringIsNotInTheAllowedValuesJSONError extends JSONErrorBase {
  constructor(
    name: string,
    value: string,
    path: string[],
    allowedValues: string[],
  ) {
    super(
      name,
      value,
      JSONErrorType.StringIsNotInTheAllowedValues,
      path,
      `String is not in the allowed values (allowed=${allowedValues}, received=${value})`
    );
  }
}
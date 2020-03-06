import { JSONErrorType, JSONErrorBase } from "../../commons/types/error.types";

export type ListJSONError =
  | ListValueIsRepeated
  | ListValueIsNotInTheAllowedValuesJSONError;

export class ListValueIsRepeated extends JSONErrorBase {
  constructor(
    name: string,
    value: string,
    path: string[],
  ) {
    super(
      name,
      value,
      JSONErrorType.StringIsNotInTheAllowedValues,
      path,
      `List value (${value}) is repeated and no repeated values are allowed.`
    );
  }
}

export class ListValueIsNotInTheAllowedValuesJSONError extends JSONErrorBase {
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
      `List value is not in the allowed values (allowed=${allowedValues}, received=${value}).`
    );
  }
}
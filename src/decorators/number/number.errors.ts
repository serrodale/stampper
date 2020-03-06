import { JSONErrorType, JSONErrorBase } from "../../commons/types/error.types";

export type StringJSONError = 
  | NumberIsNotIntegerJSONError;

export class NumberIsNotIntegerJSONError extends JSONErrorBase {
  constructor(
    name: string,
    value: number,
    path: string[],
  ) {
    super(
      name,
      value,
      JSONErrorType.StringLongerThanAllowed,
      path,
      `Number (value) is not an integer and it should be.`
    );
  }
}

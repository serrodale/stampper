import { StringLongerThanAllowedJSONError } from "../../decorators/string/string.errors";

export enum JSONErrorType {
  InvalidType,
  StringLongerThanAllowed,
  MissingRequiredProperty,
  StringShorterThanAllowed,
  StringIsNotInTheAllowedValues,
}

type JSONError =
  | InvalidTypeJSONError
  | StringLongerThanAllowedJSONError
  | MissingRequiredPropertyJSONError;

export class JSONErrorBase {
  typeCode: JSONErrorType;
  typeName: string;
  name: string;
  value: any;
  message: string;
  path: string[];

  constructor(
    name: string,
    value: any,
    typeCode: JSONErrorType,
    path: string[],
    message: string
  ) {
    this.typeCode = typeCode;
    this.typeName = JSONErrorType[typeCode];
    this.name = name;
    this.value = value;
    this.path = path;
    this.message = message;
  }
}

export class MissingRequiredPropertyJSONError extends JSONErrorBase {
  constructor(name: string, value: any, path: string[]) {
    super(
      name,
      value,
      JSONErrorType.MissingRequiredProperty,
      path,
      'Missing required property'
    );
  }
}

export class InvalidTypeJSONError extends JSONErrorBase {
  constructor(name: string, value: any, path: string[]) {
    super(
      name,
      value,
      JSONErrorType.InvalidType,
      path,
      'Invalid type'
    );
  }
}
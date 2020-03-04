import 'reflect-metadata';
import { isNil, isString } from 'lodash';

/**
 * ERRORS
 */
enum JSONErrorType {
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

class JSONErrorBase {
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

class MissingRequiredPropertyJSONError extends JSONErrorBase {
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

class InvalidTypeJSONError extends JSONErrorBase {
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

class StringShorterThanAllowedJSONError extends JSONErrorBase {
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

class StringLongerThanAllowedJSONError extends JSONErrorBase {
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

class StringIsNotInTheAllowedValuesJSONError extends JSONErrorBase {
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

/**
 * LIBRARY
 */
const propertiesWithConfigKey = Symbol();
const optionalPropertiesKey = Symbol();

export enum PropertyType {
  List,
  Number,
  String,
  OtherClass
}

export type PropertyInfo =
  | NumberPropertyInfo
  | StringPropertyInfo
  | OtherClassPropertyInfo;

export type NumberPropertyInfo = 
  & { name: string }
  & { type: PropertyType.Number }
  & NumberParams;

export type StringPropertyInfo = 
  & { name: string }
  & { type: PropertyType.String }
  & StringParams;

export type OtherClassPropertyInfo = 
  & { name: string }
  & { type: PropertyType.OtherClass }
  & OtherClassParams;

function Optional() {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(
      optionalPropertiesKey,
      (Reflect.getMetadata(optionalPropertiesKey, target) ?? []).concat(propertyKey),
      target
    );
  }
}

type PropertyDecorator = (target: object, propertyKey: string) => void;

function getPropertyDecorator(type: PropertyType, params: any): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(
      propertiesWithConfigKey,
      (Reflect.getMetadata(propertiesWithConfigKey, target) ?? []).concat({
        name: propertyKey,
        type,
        ...params
      }),
      target
    );
  }
}

interface NumberParams {
  integer: boolean;
}

function Number(params?: NumberParams) {
  return getPropertyDecorator(PropertyType.Number, params);
}

interface StringParams {
  minLength?: number;
  maxLength?: number;
  allowedValues?: string[];
}

function String(params?: StringParams) {
  return getPropertyDecorator(PropertyType.String, params);
}

interface ListParams {
  separator: string;
  allowedValues: string[];
  canBeRepeated?: boolean;
}

function List(params?: ListParams) {
  return getPropertyDecorator(PropertyType.List, params);
}

interface OtherClassParams {
  class: any;
}

function OtherClass(params: OtherClassParams) {
  return getPropertyDecorator(PropertyType.OtherClass, params);
}

class JSONValidator {

  currentPropertyPath: string[] = [];

  validateJSON(Model: any, json: any): void {
    const instance: typeof Model = new Model();
    const propertiesInfos: PropertyInfo[] = Reflect.getMetadata(propertiesWithConfigKey, instance);
    const optionalPropertiesNames: string[] = Reflect.getMetadata(optionalPropertiesKey, instance);

    propertiesInfos
      .forEach((propertyInfo: PropertyInfo) => {
        const propertyName: string = propertyInfo.name;
        const propertyValue: string = json[propertyName];
        const isOptional: boolean = (optionalPropertiesNames ?? []).includes(propertyName);
        
        const propertyType: string = Reflect.getMetadata('design:type', instance, propertyName)?.name;
        const isArray: boolean = propertyType === 'Array';

        this.validateProperty(propertyValue, propertyInfo, isOptional, isArray);
    });
  }

  validateProperty(value: any, propertyInfo: PropertyInfo, isOptional: boolean, isArray: boolean): void {
    this.currentPropertyPath.push(propertyInfo.name);
    console.log('path', this.currentPropertyPath);
    console.log('value', value);
    console.log('isArray', isArray);
    console.log('isOptional', isOptional);
    console.log();

    if (!isOptional && isNil(value)) {
      throw new MissingRequiredPropertyJSONError(
        propertyInfo.name,
        value,
        this.currentPropertyPath
      );
    }

    if (isArray) {
      if (!Array.isArray(value)) {
        throw new InvalidTypeJSONError(
          propertyInfo.name,
          value,
          this.currentPropertyPath
        );
      }

      value
        .forEach((arrayItem: any) => {
          this.currentPropertyPath.pop();
          this.validateProperty(arrayItem, propertyInfo, isOptional, false);
        });
    } else {
      switch (propertyInfo.type) {
        case PropertyType.String:
          this.validateStringProperty(propertyInfo, value);
          break;
        case PropertyType.OtherClass:
          this.validateJSON(propertyInfo.class, value);
          break;
      }
    }

    this.currentPropertyPath.pop();
  }

  validateStringProperty({
    name,
    minLength,
    maxLength,
    allowedValues,
  }: StringPropertyInfo, value: any): void {
    if (!isString(value)) {
      throw new InvalidTypeJSONError(
        name,
        value,
        this.currentPropertyPath
      );
    }

    if (!isNil(minLength) && value.length < minLength) {
      throw new StringShorterThanAllowedJSONError(
        name,
        value,
        this.currentPropertyPath,
        value.length,
        minLength
      );
    }

    if (!isNil(maxLength) && value.length > maxLength) {
      throw new StringLongerThanAllowedJSONError(
        name,
        value,
        this.currentPropertyPath,
        value.length,
        maxLength
      );
    }

    if (!isNil(allowedValues) && !allowedValues.includes(value)) {
      throw new StringIsNotInTheAllowedValuesJSONError(
        name,
        value,
        this.currentPropertyPath,
        allowedValues
      );
    }
  }


}

export function validateJSON(constructor: any, value: any) {
  return new JSONValidator().validateJSON(constructor, value);
}

/**
 * APP
 */
class City {
	@String()
  id: string;
}

class Country {
	@String()
  name: string;

	@OtherClass({ class: City })
  cities: City[];
}

 class Person {
	@List({ allowedValues: ['Pepe', 'Juan'], canBeRepeated: true, separator: ',' })
  name: string;

	@OtherClass({ class: Country })
  countriesVisited: Country[];
}

try {
  validateJSON(Person, {
    name: 'Juan',
    countriesVisited: [
      {
        name: 'Spain',
        cities: [
          {
            id: 'adiós'
          }
        ]
      }
    ],
  });
} catch (error) {
  console.log(error);
}


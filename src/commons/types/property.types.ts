import { StringParams } from "../../decorators/string/string.params";
import { NumberParams } from "../../decorators/number/number.params";
import { OtherClassParams } from "../../decorators/other-class/other-class.params";

export enum PropertyType {
  List,
  Number,
  String,
  OtherClass
}

export type PropertyDecorator = (target: object, propertyKey: string) => void;
export type PropertyParams = Record<string, any>;

export type PropertyInfo =
  | StringPropertyInfo
  | NumberPropertyInfo
  | OtherClassPropertyInfo;

export interface PropertyInfoCommons {
  name: string;
  type: PropertyType;
  params: PropertyParams;
}

export interface StringPropertyInfo extends PropertyInfoCommons {
  type: PropertyType.String;
  params: StringParams;
}

export interface NumberPropertyInfo extends PropertyInfoCommons {
  type: PropertyType.Number;
  params: NumberParams;
}

export interface OtherClassPropertyInfo extends PropertyInfoCommons {
  type: PropertyType.OtherClass;
  params: OtherClassParams;
}

import { NumberPropertyInfo } from "../../decorators/number/number.property-info";
import { StringPropertyInfo } from "../../decorators/string/string.property-info";
import { OtherClassPropertyInfo } from "../../decorators/other-class/other-class.property-info";

export enum PropertyType {
  List,
  Number,
  String,
  OtherClass
}

export type PropertyDecorator = (target: object, propertyKey: string) => void;

export interface PropertyInfo {
  name: string;
  type: PropertyType;
  params: any;
}

export interface PropertyInfoWithValue extends PropertyInfo {
  value: any;
}

export type PropertyInfo2 =
  | NumberPropertyInfo
  | StringPropertyInfo
  | OtherClassPropertyInfo;

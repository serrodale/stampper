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

export type PropertyInfo =
  | NumberPropertyInfo
  | StringPropertyInfo
  | OtherClassPropertyInfo;

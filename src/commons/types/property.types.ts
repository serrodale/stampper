import { StringParams } from "../../decorators/string/string.params";
import { NumberParams } from "../../decorators/number/number.params";
import { ClassParams } from "../../decorators/class/class.params";

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
  | ClassPropertyInfo;

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

export interface ClassPropertyInfo extends PropertyInfoCommons {
  type: PropertyType.OtherClass;
  params: ClassParams;
}

import { ListParams } from "../../decorators/list/list.params";
import { ClassParams } from "../../decorators/class/class.params";
import { NumberParams } from "../../decorators/number/number.params";
import { StringParams } from "../../decorators/string/string.params";

export enum PropertyType {
  List,
  Number,
  String,
  OtherClass
}

export type PropertyDecorator = (target: object, propertyKey: string) => void;
export type PropertyParams = Record<string, any>;

export type PropertyInfo =
  | ListPropertyInfo
  | ClassPropertyInfo
  | StringPropertyInfo
  | NumberPropertyInfo;

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

export interface ListPropertyInfo extends PropertyInfoCommons {
  type: PropertyType.List;
  params: ListParams;
}

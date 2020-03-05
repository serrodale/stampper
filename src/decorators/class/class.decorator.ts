import { ClassParams } from "./class.params";
import { PropertyType } from "../../commons/types/property.types";
import { getPropertyDecorator } from "../../commons/utils/reflect.utils";

export function Class(params: ClassParams) {
  return getPropertyDecorator(PropertyType.OtherClass, params);
}

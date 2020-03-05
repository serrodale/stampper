import { PropertyType } from "../../commons/types/property.types";
import { OtherClassParams } from "./other-class.params";
import { getPropertyDecorator } from "../../commons/utils/reflect.utils";

export function OtherClass(params: OtherClassParams) {
  return getPropertyDecorator(PropertyType.OtherClass, params);
}

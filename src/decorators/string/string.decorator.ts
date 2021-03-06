import { getPropertyDecorator } from "../../commons/utils/reflect.utils";
import { PropertyType } from "../../commons/types/property.types";
import { StringParams } from "./string.params";

export function String(params?: StringParams) {
  return getPropertyDecorator(PropertyType.String, params);
}

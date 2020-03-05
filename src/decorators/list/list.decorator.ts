import { ListParams } from "./list.params";
import { PropertyType } from "../../commons/types/property.types";
import { getPropertyDecorator } from "../../commons/utils/reflect.utils";

export function List(params?: ListParams) {
  return getPropertyDecorator(PropertyType.List, params);
}

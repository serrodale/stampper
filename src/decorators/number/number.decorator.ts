import { NumberParams } from "./number.params";
import { PropertyType } from "../../commons/types/property.types";
import { getPropertyDecorator } from "../../commons/utils/decorator.utils";

export function Number(params?: NumberParams) {
  return getPropertyDecorator(PropertyType.Number, params);
}

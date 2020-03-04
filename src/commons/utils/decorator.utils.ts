import { propertiesWithConfigKey } from "../constants/symbols.constants";
import { PropertyType } from "../types/property.types";

export function getPropertyDecorator(type: PropertyType, params: any): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(
      propertiesWithConfigKey,
      (Reflect.getMetadata(propertiesWithConfigKey, target) ?? []).concat({
        name: propertyKey,
        type,
        ...params
      }),
      target
    );
  }
}
import { optionalPropertiesKey } from "../../commons/constants/symbols.constants";

export function Optional() {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(
      optionalPropertiesKey,
      (Reflect.getMetadata(optionalPropertiesKey, target) ?? []).concat(propertyKey),
      target
    );
  }
}
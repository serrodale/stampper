import 'reflect-metadata';

import { PropertyType, PropertyInfo } from '../types/property.types';
import { propertiesWithConfigKey, optionalPropertiesKey } from '../constants/symbols.constants';

export function getPropertyDecorator(type: PropertyType, params: any): PropertyDecorator {
  return (target: object, name: string) => {
    Reflect.defineMetadata(
      propertiesWithConfigKey,
      [...getPropertiesInfo(target), { name, params, type }],
      target,
    );
  };
}

export function getPropertiesInfo(target: any): PropertyInfo[] {
  return Reflect.getMetadata(propertiesWithConfigKey, target) ?? [];
}

export function getOptionalPropertiesNames(target: any): string[] {
  return Reflect.getMetadata(propertiesWithConfigKey, target) ?? [];
}

export function propertyIsOptional(target: any, name: string): boolean {
  return getOptionalPropertiesNames(target).includes(name);
}

export function propertyIsArray(target: any, name: string): boolean {
  return Reflect.getMetadata('design:type', target, name).name === 'Array';
}

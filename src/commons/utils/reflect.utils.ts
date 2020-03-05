import 'reflect-metadata';

import { propertiesWithConfigKey } from '../constants/symbols.constants';
import { PropertyType, PropertyInfo } from '../types/property.types';

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

export function propertyIsArray(target: any, name: string): boolean {
  return Reflect.getMetadata('design:type', target, name).name === 'Array';
}

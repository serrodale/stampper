import { isNil } from 'lodash';
import { ListValidator } from './decorators/list/list.validator';
import { StringValidator } from './decorators/string/string.validator';
import { NumberValidator } from './decorators/number/number.validator';
import { PropertyType, PropertyInfo } from './commons/types/property.types';

import {
  InvalidTypeJSONError,
  MissingRequiredPropertyJSONError,
} from './commons/types/error.types';

import {
  propertyIsArray,
  getPropertiesInfo,
} from './commons/utils/reflect.utils';

class JSONValidator {

  propertyPath: string[] = [];

  validateJSON(Model: any, json: any): void {
    const instance: typeof Model = new Model();
    const propertiesInfos: PropertyInfo[] = getPropertiesInfo(instance);

    propertiesInfos.forEach((propertyInfo: PropertyInfo) => {
      const name: string = propertyInfo.name;
      const value: string = json[name];
      const isArray: boolean = propertyIsArray(instance, name);
      const isOptional: boolean = !!propertyInfo.params?.optional;

      this.validateProperty(value, propertyInfo, isOptional, isArray);
    });
  }

  validateProperty(
    value: any,
    propertyInfo: PropertyInfo,
    isOptional: boolean,
    isArray: boolean,
  ): void {
    this.propertyPath.push(propertyInfo.name);

    if (isOptional && isNil(value)) {
      return;
    }

    if (!isOptional) {
      this.validateRequiredProperty(value, propertyInfo);
    }

    if (isArray) {
      this.validateArrayProperty(value, propertyInfo, isOptional);
    } else {
      this.validatePropertyByType(value, propertyInfo);
    }

    this.propertyPath.pop();
  }

  validateRequiredProperty(value: any, propertyInfo: PropertyInfo): void {
    if (isNil(value)) {
      throw new MissingRequiredPropertyJSONError(
        propertyInfo.name,
        value,
        this.propertyPath,
      );
    }
  }

  validateArrayProperty(
    value: any,
    propertyInfo: PropertyInfo,
    isOptional: boolean,
  ): void {
    if (!Array.isArray(value)) {
      throw new InvalidTypeJSONError(propertyInfo.name, value, this.propertyPath);
    }

    value.forEach((arrayItem: any) => {
      this.propertyPath.pop();
      this.validateProperty(arrayItem, propertyInfo, isOptional, false);
    });
  }

  validatePropertyByType(value: any, propertyInfo: PropertyInfo): void {
    switch (propertyInfo.type) {
      case PropertyType.String:
        new StringValidator(value, propertyInfo.params, this.propertyPath).validate()
        break;
      case PropertyType.Number:
        new NumberValidator(value, propertyInfo.params, this.propertyPath).validate()
        break;
      case PropertyType.List:
        new ListValidator(value, propertyInfo.params, this.propertyPath).validate()
        break;
      case PropertyType.OtherClass:
        this.validateJSON(propertyInfo.params.class, value);
        break;
    }
  }

}

export function validateJSON(target: any, value: any) {
  return new JSONValidator().validateJSON(target, value);
}


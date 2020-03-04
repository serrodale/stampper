import 'reflect-metadata';
import { isNil, isString } from 'lodash';

import { StringPropertyInfo } from './decorators/string/string.property-info';
import { PropertyType, PropertyInfo } from './commons/types/property.types';
import { propertiesWithConfigKey, optionalPropertiesKey } from './commons/constants/symbols.constants';
import { MissingRequiredPropertyJSONError, InvalidTypeJSONError } from './commons/types/error.types';
import { StringShorterThanAllowedJSONError, StringLongerThanAllowedJSONError, StringIsNotInTheAllowedValuesJSONError } from './decorators/string/string.errors';

class JSONValidator {

  currentPropertyPath: string[] = [];

  validateJSON(Model: any, json: any): void {
    const instance: typeof Model = new Model();
    const propertiesInfos: PropertyInfo[] = Reflect.getMetadata(propertiesWithConfigKey, instance);
    const optionalPropertiesNames: string[] = Reflect.getMetadata(optionalPropertiesKey, instance);

    propertiesInfos
      .forEach((propertyInfo: PropertyInfo) => {
        const propertyName: string = propertyInfo.name;
        const propertyValue: string = json[propertyName];
        const isOptional: boolean = (optionalPropertiesNames ?? []).includes(propertyName);
        
        const propertyType: string = Reflect.getMetadata('design:type', instance, propertyName)?.name;
        const isArray: boolean = propertyType === 'Array';

        this.validateProperty(propertyValue, propertyInfo, isOptional, isArray);
    });
  }

  validateProperty(value: any, propertyInfo: PropertyInfo, isOptional: boolean, isArray: boolean): void {
    this.currentPropertyPath.push(propertyInfo.name);
    console.log('path', this.currentPropertyPath);
    console.log('value', value);
    console.log('isArray', isArray);
    console.log('isOptional', isOptional);
    console.log();

    if (!isOptional && isNil(value)) {
      throw new MissingRequiredPropertyJSONError(
        propertyInfo.name,
        value,
        this.currentPropertyPath
      );
    }

    if (isArray) {
      if (!Array.isArray(value)) {
        throw new InvalidTypeJSONError(
          propertyInfo.name,
          value,
          this.currentPropertyPath
        );
      }

      value
        .forEach((arrayItem: any) => {
          this.currentPropertyPath.pop();
          this.validateProperty(arrayItem, propertyInfo, isOptional, false);
        });
    } else {
      switch (propertyInfo.type) {
        case PropertyType.String:
          this.validateStringProperty(propertyInfo, value);
          break;
        case PropertyType.OtherClass:
          this.validateJSON(propertyInfo.class, value);
          break;
      }
    }

    this.currentPropertyPath.pop();
  }

  validateStringProperty({
    name,
    minLength,
    maxLength,
    allowedValues,
  }: StringPropertyInfo, value: any): void {
    if (!isString(value)) {
      throw new InvalidTypeJSONError(
        name,
        value,
        this.currentPropertyPath
      );
    }

    if (!isNil(minLength) && value.length < minLength) {
      throw new StringShorterThanAllowedJSONError(
        name,
        value,
        this.currentPropertyPath,
        value.length,
        minLength
      );
    }

    if (!isNil(maxLength) && value.length > maxLength) {
      throw new StringLongerThanAllowedJSONError(
        name,
        value,
        this.currentPropertyPath,
        value.length,
        maxLength
      );
    }

    if (!isNil(allowedValues) && !allowedValues.includes(value)) {
      throw new StringIsNotInTheAllowedValuesJSONError(
        name,
        value,
        this.currentPropertyPath,
        allowedValues
      );
    }
  }
}

export function validateJSON(constructor: any, value: any) {
  return new JSONValidator().validateJSON(constructor, value);
}


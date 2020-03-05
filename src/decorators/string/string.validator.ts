import { isNil, isString } from 'lodash';
import { InvalidTypeJSONError } from '../../commons/types/error.types';

import {
  StringLongerThanAllowedJSONError,
  StringShorterThanAllowedJSONError,
  StringIsNotInTheAllowedValuesJSONError,
} from './string.errors';

export class StringValidator {

  name: any;
  value: any;
  propertyInfo: any;
  propertyPath: string[];

  constructor(
    value: any,
    propertyInfo: any,
    propertyPath: string[],
  ) {
    this.name = propertyPath.slice(-1);
    this.value = value;
    this.propertyInfo = propertyInfo;
    this.propertyPath = propertyPath;
  }

  validate(): void {
    this.validateIsString();
    this.validateIsLongerThanMinLengthIfAny();
    this.validateIsShorterThanMaxLengthIfAny();
    this.validateIsInTheAllowedValuesListIfAny();
  }

  private validateIsString(): void {
    if (!isString(this.value)) {
      throw new InvalidTypeJSONError(this.name, this.value, this.propertyPath);
    }
  }

  private validateIsLongerThanMinLengthIfAny(): void {
    if (
      !isNil(this.propertyInfo?.minLength) &&
      this.value.length < this.propertyInfo.minLength
    ) {
      throw new StringShorterThanAllowedJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.value.length,
        this.propertyInfo.minLength,
      );
    }
  }
  
  private validateIsShorterThanMaxLengthIfAny(): void {
    if (
      !isNil(this.propertyInfo?.maxLength) &&
      this.value.length < this.propertyInfo.maxLength
    ) {
      throw new StringLongerThanAllowedJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.value.length,
        this.propertyInfo.maxLength,
      );
    }
  }
  
  private validateIsInTheAllowedValuesListIfAny(): void {
    if (
      !isNil(this.propertyInfo?.allowedValues) &&
      !this.propertyInfo.allowedValues.includes(this.value)
    ) {
      throw new StringIsNotInTheAllowedValuesJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.propertyInfo.allowedValues,
      );
    }
  }
  
}

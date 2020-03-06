import { Validator } from '../../commons/types/validator.type';
import { StringParams } from './string.params';
import { isNil, isString } from 'lodash';
import { InvalidTypeJSONError } from '../../commons/types/error.types';

import {
  StringLongerThanAllowedJSONError,
  StringShorterThanAllowedJSONError,
  StringIsNotInTheAllowedValuesJSONError,
} from './string.errors';

export class StringValidator extends Validator {

  minLength: number;
  maxLength: number;
  allowedValues: string[];

  constructor(
    value: any,
    params: StringParams,
    propertyPath: string[],
  ) {
    super(value, propertyPath);

    this.minLength = params?.minLength;
    this.maxLength = params?.maxLength;
    this.allowedValues = params?.allowedValues;
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
      !isNil(this.minLength) &&
      this.value.length < this.minLength
    ) {
      throw new StringShorterThanAllowedJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.value.length,
        this.minLength,
      );
    }
  }
  
  private validateIsShorterThanMaxLengthIfAny(): void {
    if (!isNil(this.maxLength) && this.value.length < this.maxLength) {
      throw new StringLongerThanAllowedJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.value.length,
        this.maxLength,
      );
    }
  }
  
  private validateIsInTheAllowedValuesListIfAny(): void {
    if (!isNil(this.allowedValues) && !this.allowedValues.includes(this.value)) {
      throw new StringIsNotInTheAllowedValuesJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.allowedValues,
      );
    }
  }
  
}

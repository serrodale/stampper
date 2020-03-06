import { isNil } from 'lodash';
import { Validator } from '../../commons/types/validator.type';

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
    propertyInfo: any,
    propertyPath: string[],
  ) {
    super(value, propertyPath);

    this.minLength = propertyInfo?.minLength;
    this.maxLength = propertyInfo?.maxLength;
    this.allowedValues = propertyInfo?.allowedValues;
  }

  validate(): void {
    this.validateIsLongerThanMinLengthIfAny();
    this.validateIsShorterThanMaxLengthIfAny();
    this.validateIsInTheAllowedValuesListIfAny();
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

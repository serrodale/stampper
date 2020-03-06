import { Validator } from '../../commons/types/validator.type';
import { NumberParams } from './number.params';
import { isNil, isInteger } from 'lodash';
import { InvalidTypeJSONError } from '../../commons/types/error.types';
import { NumberIsNotIntegerJSONError } from './number.errors';

export class NumberValidator extends Validator {

  isInteger: boolean;

  constructor(
    value: any,
    params: NumberParams,
    propertyPath: string[],
  ) {
    super(value, propertyPath);

    this.isInteger = params?.isInteger;
  }

  validate(): void {
    this.validateIsNumber();
    this.validateIsIntegerIfItHasToBe();
  }

  private validateIsNumber(): void {
    if (!isNil(this.value) && !isInteger(this.value)) {
      throw new InvalidTypeJSONError(this.name, this.value, this.propertyPath);
    }
  }

  private validateIsIntegerIfItHasToBe(): void {
    if (this.isInteger && !isInteger()) {
      throw new NumberIsNotIntegerJSONError(this.name, this.value, this.propertyPath);
    }
  }

}

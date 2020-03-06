import { isNil } from 'lodash';
import { Validator } from "../../commons/types/validator.type";
import { ListParams } from './list.params';

import {
  ListValueIsRepeated,
  ListValueIsNotInTheAllowedValuesJSONError,
} from './list.errors';

export class ListValidator extends Validator {

  values: string[];
  separator: string;
  allowedValues: string[];
  allowRepeatedValues: boolean;
  
  constructor(
    value: any,
    params: ListParams,
    propertyPath: string[],
  ) {
    super(value, propertyPath);

    this.separator = params?.separator;
    this.values = value.split(this.separator);
    this.allowedValues = params?.allowedValues;
    this.allowRepeatedValues = !!params?.allowRepeatedValues;
  }

  validate(): void {
    this.validateThatValuesAreNotRepeatedIfTheyCant();
    this.validateThatValuesAreAllowedIfAllowedValues();
  }

  private validateThatValuesAreNotRepeatedIfTheyCant(): void {
    if (this.valuesAreRepeatedAndTheyCant()) {
      throw new ListValueIsRepeated(
        this.name,
        this.value,
        this.propertyPath,
      );
    }
  }

  private valuesAreRepeatedAndTheyCant(): boolean {
    return (
      this.allowRepeatedValues &&
      this.values.some((value: string, index: number) =>
        this.values.slice(index).includes(value),
      )
    );
  } 

  private validateThatValuesAreAllowedIfAllowedValues(): void {
    if (this.someValueIsNotInTheAllowedValuesIfAny()) {
      throw new ListValueIsNotInTheAllowedValuesJSONError(
        this.name,
        this.value,
        this.propertyPath,
        this.allowedValues,
      );
    }
  }

  private someValueIsNotInTheAllowedValuesIfAny(): boolean {
    return (
      !isNil(this.allowedValues) &&
      this.values.some((value: string) => !this.allowedValues.includes(value))
    );
  }

}

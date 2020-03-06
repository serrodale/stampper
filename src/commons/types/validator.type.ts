export abstract class Validator {

  name: any;
  value: any;
  propertyPath: string[];

  constructor(
    value: any,
    propertyPath: string[],
  ) {
    this.name = propertyPath.slice(-1);
    this.value = value;
    this.propertyPath = propertyPath;
  }

  abstract validate(): void;

}

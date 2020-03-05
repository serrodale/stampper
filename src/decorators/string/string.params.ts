import { Params } from "../../commons/types/params.type";

export interface StringParams extends Params {
  minLength?: number;
  maxLength?: number;
  allowedValues?: string[];
}
import { Params } from "../../commons/types/params.type";

export interface ListParams extends Params {
  separator: string;
  allowedValues?: string[];
  allowRepeatedValues?: boolean;
}

import { PropertyType } from "../../commons/types/property.types";
import { StringParams } from "./string.params";

export type StringPropertyInfo = 
  & { name: string }
  & { type: PropertyType.String }
  & StringParams;

import { NumberParams } from "./number.params";
import { PropertyType } from "../../commons/types/property.types";

export type NumberPropertyInfo = 
  & { name: string }
  & { type: PropertyType.Number }
  & NumberParams;

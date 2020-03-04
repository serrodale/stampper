import { PropertyType } from "../../commons/types/property.types";
import { OtherClassParams } from "./other-class.params";

export type OtherClassPropertyInfo = 
  & { name: string }
  & { type: PropertyType.OtherClass }
  & OtherClassParams;

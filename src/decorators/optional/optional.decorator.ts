import { optionalPropertiesKey } from '../../commons/constants/symbols.constants';
import { getOptionalPropertiesNames } from '../../commons/utils/reflect.utils';

export function Optional() {
  return (target: object, name: string) => {
    Reflect.defineMetadata(
      optionalPropertiesKey,
      [...getOptionalPropertiesNames(target), name],
      target,
    );
  };
}

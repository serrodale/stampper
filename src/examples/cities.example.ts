import { List } from "../decorators/list/list.decorator";
import { Class } from "../decorators/class/class.decorator";
import { Number } from "../decorators/number/number.decorator";
import { String } from "../decorators/string/string.decorator";

import { validateJSON } from "..";

/**
 * APP
 */
class City {
	@String()
  id: string;
}

class Country {
	@String()
  name: string;

	@Class({ class: City })
  cities: City[];
}

class Person {
	@List({ allowedValues: ['Pepe', 'Juan'], separator: ',' })
  name: string;

  @Number()
  yearBorn: number;

	@Class({ class: Country })
  countriesVisited: Country[];

  @String({ isOptional: true })
  optionalProperty: string;
}

try {
  validateJSON(Person, {
    name: 'Juan',
    countriesVisited: [
      {
        name: 'Spain',
        cities: [
          {
            id: 'adiós'
          }
        ]
      }
    ],
  });
} catch (error) {
  console.log(error);
}
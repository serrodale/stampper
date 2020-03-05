import { List } from "../decorators/list/list.decorator";
import { Class } from "../decorators/class/class.decorator";
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
	@List({ allowedValues: ['Pepe', 'Juan'], canBeRepeated: true, separator: ',' })
  name: string;

	@Class({ class: Country })
  countriesVisited: Country[];

  @String({ optional: true })
  optionalProperty: string;
}

try {
  validateJSON(Person, {
    name: 'Juann',
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
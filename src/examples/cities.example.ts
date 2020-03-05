import { List } from "../decorators/list/list.decorator";
import { Class } from "../decorators/class/class.decorator";
import { String } from "../decorators/string/string.decorator";
import { Optional } from "../decorators/optional/optional.decorator";

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

  @Optional()
	@Class({ class: Country })
  countriesVisited: Country[];
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
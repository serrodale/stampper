import { OtherClass } from "../decorators/other-class/other-class.decorator";
import { List } from "../decorators/list/list.decorator";
import { validateJSON } from "..";
import { String } from "../decorators/string/string.decorator";

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

	@OtherClass({ class: City })
  cities: City[];
}

 class Person {
	@List({ allowedValues: ['Pepe', 'Juan'], canBeRepeated: true, separator: ',' })
  name: string;

	@OtherClass({ class: Country })
  countriesVisited: Country[];
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
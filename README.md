TS decorators-based JSON validator.

### Example

First, define the model.

```ts
class Person {
  @String({ minLength: 5})
  name: string;

  @Number({ optional: true })
  years: number;

  @List({ allowedValues: ['ES', 'EN', 'FR'], separator: ',' })
  languages: string;

  @Class({ class: Country })
  countriesVisited: Country[];
}

class Country {
  @String()
  name: string;

  @Class({ class: City })
  cities: City[];
}

class City {
  @String()
  name: string;
}
```

And, then, call ``validateJSON`` passing the model and the JSON value to be validated. 

```ts
validateJSON(Person, {
  name: 'Name',
  years: 50,
  languages: 'ES,EN',
  countriesVisited: [
    {
      name: 'Spain',
      cities: [
        { name: 'Madrid' },
        { name: 'Valencia' },
      ]
    }
  ],
});
```

If an invalid JSON is provided, an error will be thrown. Example:

```ts
try {
  validateJSON(Person, {
    name: 'Name',
    years: 50,
    languages: 'ES,EN',
    countriesVisited: [
      {
        // name: 'Spain', <- This required property is removed
        cities: [
          { name: 'Madrid' },
          { name: 'Valencia' },
        ]
      }
    ],
  });
} catch (error) {
  console.error(error);
}
```

Will result in the following error printed out:

```ts
MissingRequiredPropertyJSONError {
  typeCode: 2,
  typeName: 'MissingRequiredProperty',
  name: 'name',
  value: undefined,
  path: [ 'countriesVisited', 'name' ],
  message: 'Missing required property'
}
```

### Validators

The list below contains the validators/decorators that are currently supported along with their options.

#### @String()

| Property name | Description                                | Possible values   | Associated errors                      | Required |
|---------------|--------------------------------------------|-------------------|----------------------------------------|-----------
| minLength     | The minimum length allowed for the string. | Integer values   | ``StringShorterThanAllowedJSONError``      |No
| maxLength     | The maximum length allowed for the string. | Integer values   | ``StringLongerThanAllowedJSONError``       |No
| allowedValues | The list of allowed values.                | Array of strings | ``StringIsNotInTheAllowedValuesJSONError`` |No

#### @List()

| Property name       | Description                                                               | Possible values   | Associated errors                | Required |
|---------------------|---------------------------------------------------------------------------|-------------------|----------------------------------|----------|
| separator           | The string that separates the elements of the list. For example, a comma: ``,``.     | Any string        | *None* | Yes     |
| allowRepeatedValues | Whether values can be repeated or not.                                                                           |      Boolean             | ``ListValueIsRepeated``                               | No    |
| allowedValues       | List of the values that are allowed. All of them has to be in this array. | Array of strings | ``ListValueIsNotInTheAllowedValuesJSONError``                                | No    |

#### @Number()

| Property name | Description                                                                | Possible values | Associated errors | Required |
|---------------|----------------------------------------------------------------------------|-----------------|-------------------|----------|
| ``isInteger``         | Whether is integer or not. | Boolean       | ``NumberIsNotIntegerJSONError``            | No     |

#### @Class()

| Property name | Description                                                                | Possible values | Associated errors | Required |
|---------------|----------------------------------------------------------------------------|-----------------|-------------------|----------|
| ``class``         | The class that defines the shape of the object associated to the property. | Any class       | *None*            | Yes     |


#### Options available for all the validators
| Property name | Description                                                             | Possible values | Associated errors                | Required |
|---------------|-------------------------------------------------------------------------|-----------------|----------------------------------|----------|
| ``isOptional``    | If true and no value (``null`` or ``undefined``), the validator will ignore it. | Boolean  | MissingRequiredPropertyJSONError | No     |`
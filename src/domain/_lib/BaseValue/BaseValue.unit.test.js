import { BaseValue } from '.';

const attr1 = 10;
const attr2 = 'ten';
const anotherAttr1 = 'twenty';
const anotherAttr2 = 20.0;

const props = { attr1, attr2 };
const anotherProps = { attr1: anotherAttr1, attr2: anotherAttr2 };

class ConcreteValue extends BaseValue {
  constructor({ attr1, attr2 }) {
    super();
    this.attr1 = attr1;
    this.attr2 = attr2;
  }
}

class AnotherConcreteValue extends BaseValue {
  constructor({ attr1, attr2 }) {
    super();
    this.attr1 = attr1;
    this.attr2 = attr2;
  }
}

describe('Domain :: lib :: BaseValue', () => {
  context('when two instance reference to same object', () => {
    test('should be equal', () => {
      const valueObject = new BaseValue();
      const sameValueObject = valueObject;

      expect(valueObject.equals(sameValueObject)).toBeTruthy();
    });
  });

  context('when two instance of same class have equals attributes', () => {
    test('should be equal', () => {
      const valueObject = new ConcreteValue(props);
      const equalValueObject = new ConcreteValue(props);

      expect(valueObject.equals(equalValueObject)).toBeTruthy();
    });
  });

  context('when two instance of same class have non-equals attributes', () => {
    test("shouldn't be equal", () => {
      const valueObject = new ConcreteValue(props);
      const anotherValueObject = new ConcreteValue(anotherProps);

      expect(valueObject.equals(anotherValueObject)).toBeFalsy();
    });
  });

  context('when two instance of different class have equals attributes', () => {
    test("shouldn't be equal", () => {
      const valueObject = new ConcreteValue(props);
      const anotherValueObject = new AnotherConcreteValue(props);

      expect(valueObject.equals(anotherValueObject)).toBeFalsy();
    });
  });

  context(
    'when two instance of different class have non-equals attributes',
    () => {
      test("shouldn't be equal", () => {
        const valueObject = new ConcreteValue(props);
        const anotherValueObject = new AnotherConcreteValue(anotherProps);

        expect(valueObject.equals(anotherValueObject)).toBeFalsy();
      });
    }
  );

  context('when value objects include value objects that and are', () => {
    class CompositeValue extends BaseValue {
      constructor({ valueObj, attr1, attr2 }) {
        super();
        this.valueObj = valueObj;
        this.attr1 = attr1;
        this.attr2 = attr2;
      }
    }

    const valueObj = new ConcreteValue(props);
    const anotherValueObj = new ConcreteValue(anotherProps);

    context('equal', () => {
      test('should be equal', () => {
        const valueObject1 = new CompositeValue({ ...props, valueObj });
        const valueObject2 = new CompositeValue({ ...props, valueObj });

        expect(valueObject1.equals(valueObject2)).toBeTruthy();
      });
    });

    context('not equal', () => {
      test('should not be equal', () => {
        const valueObject1 = new CompositeValue({ ...props, valueObj });
        const valueObject2 = new CompositeValue({
          ...props,
          valueObj: anotherValueObj,
        });

        expect(valueObject1.equals(valueObject2)).toBeFalsy();
      });
    });
  });
});

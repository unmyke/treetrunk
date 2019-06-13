import { startOfDay } from 'date-fns';
import ValueObject from '../value-object';
import injectOptionsToFactory from '../inject-options-to-factory';
import * as optionInjectors from './option-injectors';

const DayFactory = (date) => {
  const value = startOfDay(date);
  const valueOf = () => value.valueOf();
  const toString = () => value.toString();

  return Object.freeze({
    value,
    valueOf,
    toString,
  });
};

const Day = injectOptionsToFactory(optionInjectors)(DayFactory);

export default ValueObject(Day);

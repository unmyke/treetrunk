import { startOfDay } from 'date-fns';

export const isValidDate = (date = new Date('Invalid Date')) => date.constructor.name === 'Date' && !isNaN(date.getTime());

export const convertDate = (date) => {
  if (date === undefined) {
    return undefined;
  }

  if (isValidDate(date)) {
    return startOfDay(date);
  }

  return new Date('Invalid Date');
};

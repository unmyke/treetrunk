import { startOfWeek as startOfWeekFns } from 'date-fns';

const startOfWeekOptionInjector = (Day) => (date, opts = {}) => {
  const { startOfWeek } = opts;

  return Day(startOfWeek ? date : startOfWeekFns(date));
};

export default startOfWeekOptionInjector;

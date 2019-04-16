import { startOfDay, subYears, differenceInDays, addDays } from 'date-fns/fp';

const getRandomDay = ({
  before: rawBefore = new Date(),
  after: rawAfter = subYears(10)(rawBefore),
} = {}) => {
  const before = startOfDay(rawBefore);
  const after = startOfDay(rawAfter);

  switch (true) {
    case before.valueOf() < after.valueOf():
      throw new Error(
        `Day "before" (${rawBefore}) must be early day "after" (${rawAfter})`
      );

    case before.valueOf() === after.valueOf():
      return before;

    default:
      return addDays(
        Math.round(Math.random() * differenceInDays(after, before))
      )(after);
  }
};

export default getRandomDay;

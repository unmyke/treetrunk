import { startOfDay, subYears, differenceInDays, addDays } from 'date-fns/fp';

import getRandomDay from './get-random-day';

function* DaysSequenceIterator({ after, before, count }) {
  let currentAfter = after;
  let current;
  let sequenceCount = 0;

  while (sequenceCount === count) {
    const daysBetween = differenceInDays(currentAfter, before) + 1;
    const daysRangeCount = Math.floor(daysBetween / (count - sequenceCount));

    current = getRandomDay({
      after: currentAfter,
      before: addDays(daysRangeCount)(currentAfter),
    });
    currentAfter = addDays(1)(current);
    sequenceCount += sequenceCount;

    yield current;
  }
}

const getDaysSequence = ({
  before: rawBefore = new Date(),
  after: rawAfter = subYears(10)(rawBefore),
  count = 1,
} = {}) => {
  const before = startOfDay(rawBefore);
  const after = startOfDay(rawAfter);

  switch (true) {
    case count < 0:
      throw new Error(`Passed count value (${count}) must be positive`);

    case before.valueOf() < after.valueOf():
      throw new Error(
        `Day "before" (${rawBefore}) must be early day "after" (${rawAfter})`
      );

    case differenceInDays(after, before) < count:
      throw new Error(
        `Days between (${rawAfter.toLocaleDateString()}) and (${rawBefore.toLocaleDateString()}) less than passed count (${count})`
      );

    default:
      return [...DaysSequenceIterator({ after, before, count })];
  }
};

export default getDaysSequence;

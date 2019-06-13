import { startOfWeek as startOfWeekFns } from 'date-fns';

const createStartOfWeek = (create) => (date) => create(startOfWeekFns(date));

export default createStartOfWeek;

import { startOfDay } from 'date-fns';

const getRandomDay = () =>
  startOfDay(new Date(Math.floor(Math.random() * Date.now())));

export default getRandomDay;

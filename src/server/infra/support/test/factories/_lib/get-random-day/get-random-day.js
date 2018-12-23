import { startOfDay } from 'date-fns';

export const getRandomDay = () =>
  startOfDay(new Date(Math.floor(Math.random() * Date.now())));

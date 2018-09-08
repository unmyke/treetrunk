import { getRandomDay } from './getRandomDay';

describe('infra :: support :: factories :: lib :: #getRandomDay', () => {
  test('should return day before now', () => {
    const randomDate = getRandomDay();

    expect(randomDate).toBeInstanceOf(Date);
    expect(randomDate.getHours()).toBe(0);
    expect(randomDate.getMinutes()).toBe(0);
    expect(randomDate.getSeconds()).toBe(0);
    expect(randomDate.getMilliseconds()).toBe(0);
    expect(randomDate.valueOf()).toBeLessThanOrEqual(Date.now().valueOf());
  });
});

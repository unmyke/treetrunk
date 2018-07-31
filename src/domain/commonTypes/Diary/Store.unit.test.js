import { Store } from './Store';
import { Day } from '../Day';
let store;

const day1 = new Day({ value: new Date('2017.01.01 00:00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00:00.000+08:00') });

const value1 = 'value1';
const value2 = 'value2';
const value3 = 'value3';
const value4 = 'value4';
const value5 = 'value5';
const value6 = 'value6';
const value7 = 'value7';
const value8 = 'value8';

const records = [
  { value: value2, day: day2 },
  { value: value4, day: day4 },
  { value: value5, day: day5 },
  { value: value3, day: day3 },
  { value: value1, day: day1 },
];

const recordsToUpdate = [
  { value: value7, day: day7 },
  { value: value5, day: day5 },
  { value: value4, day: day4 },
  { value: value2, day: day2 },
];

let record1;
let record2;
let record3;
let record4;
let record5;
let record6;
let record7;
let record8;

describe('Domain :: commonTypes :: Store', () => {
  beforeEach(() => {
    store = new Store();
  });

  describe('#add', () => {
    test('should add record to store', () => {
      store.add(value1, day1);

      const { value, day, prev, next, isStored, isClose } = store.get(day1);

      expect(value).toBe(value1);
      expect(day).toEqual(day1);
      expect(prev).toBeUndefined();
      expect(next).toBeUndefined();
      expect(isStored).toBeTruthy();
      expect(isClose).toBeFalsy();
    });
  });

  describe('#set', () => {
    test('should add records to store and sets to records prev/next props', () => {
      store.set(records);

      record1 = store.get(day1);
      record2 = store.get(day2);
      record3 = store.get(day3);
      record4 = store.get(day4);
      record5 = store.get(day5);

      expect(record1.prev).toBeUndefined();
      expect(record1.next).toBe(record2);
      expect(record2.prev).toBe(record1);
      expect(record2.next).toBe(record3);
      expect(record3.prev).toBe(record2);
      expect(record3.next).toBe(record4);
      expect(record4.prev).toBe(record3);
      expect(record4.next).toBe(record5);
      expect(record5.prev).toBe(record4);
      expect(record5.next).toBeUndefined();
    });
  });

  describe('#delete', () => {
    beforeEach(() => {
      store.set(records);

      record1 = store.get(day1);
      record2 = store.get(day2);
      record3 = store.get(day3);
      record4 = store.get(day4);
      record5 = store.get(day5);
    });

    context('when delete first record from store', () => {
      test('should set isStored-prop of first record to false and re-set prev/next', () => {
        store.delete(day1);

        expect(record1.isStored).toBeFalsy();
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBeUndefined();
        expect(record2.prev).toBeUndefined();
        expect(record2.next).toBe(record3);
      });
    });

    context('when delete middle record from store', () => {
      test('should set isStored-prop of middle record to false and re-set prev/next', () => {
        store.delete(day3);

        expect(record3.isStored).toBeFalsy();
        expect(record3.next).toBeUndefined();
        expect(record3.prev).toBeUndefined();
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record4);
        expect(record4.prev).toBe(record2);
        expect(record4.next).toBe(record5);
      });
    });

    context('when delete last record from store', () => {
      test('should set isStored-prop of last record to false and re-set prev/next', () => {
        store.delete(day5);

        expect(record5.isStored).toBeFalsy();
        expect(record5.next).toBeUndefined();
        expect(record5.prev).toBeUndefined();
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBeUndefined();
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      store.set(recordsToUpdate);

      record1 = store.get(day1);
      record2 = store.get(day2);
      record3 = store.get(day3);
      record4 = store.get(day4);
      record5 = store.get(day5);
      record6 = store.get(day6);
      record7 = store.get(day7);
      record8 = store.get(day8);
    });

    context('when update first record to be last', () => {
      test('should upate store and re-set prev/next', () => {
        store.update(day2, value8, day8);
        record8 = store.get(day8);

        expect(record2.isStored).toBeFalsy();
        expect(record2.prev).toBeUndefined();
        expect(record2.next).toBeUndefined();

        expect(record8.isStored).toBeTruthy();
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();

        expect(record4.prev).toBeUndefined();
        expect(record4.next).toBe(record5);

        expect(record7.prev).toBe(record5);
        expect(record7.next).toBe(record8);
      });
    });

    context('when delete middle record from store', () => {
      test('should set isStored-prop of middle record to false and re-set prev/next', () => {});
    });

    context('when delete last record from store', () => {
      test('should set isStored-prop of last record to false and re-set prev/next', () => {});
    });
  });
});

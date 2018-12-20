import { Day } from '../day';
import { Store } from './store';
import { Record } from './record';

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
  { value: value8, day: day8 },
  { value: value3, day: day3 },
  { value: value1, day: day1 },
  { value: value4, day: day4 },
  { value: value7, day: day7 },
  { value: value2, day: day2 },
  { value: value5, day: day5 },
  { value: value6, day: day6 },
];

const recordsToUpdate = [
  { value: value4, day: day4 },
  { value: value7, day: day7 },
  { value: value2, day: day2 },
  { value: value5, day: day5 },
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
    record1 = undefined;
    record2 = undefined;
    record3 = undefined;
    record4 = undefined;
    record5 = undefined;
    record6 = undefined;
    record7 = undefined;
    record8 = undefined;
  });

  describe('#getNeighbours', () => {
    beforeEach(() => {
      record1 = new Record({ value: value1, day: day1 });
      record1.setPrev();
      record2 = new Record({ value: value2, day: day2 });
      record1.setNext(record2);
      record2.setPrev(record1);
      record3 = new Record({ value: value3, day: day3 });
      record2.setNext(record3);
      record3.setPrev(record2);
      record4 = new Record({ value: value4, day: day4 });
      record3.setNext(record4);
      record4.setPrev(record3);
      record5 = new Record({ value: value5, day: day5 });
      record4.setNext(record5);
      record5.setPrev(record4);
      record6 = new Record({ value: value6, day: day6 });
      record5.setNext(record6);
      record6.setPrev(record5);
      record7 = new Record({ value: value7, day: day7 });
      record6.setNext(record7);
      record7.setPrev(record6);
      record8 = new Record({ value: value8, day: day8 });
      record7.setNext(record8);
      record8.setPrev(record7);

      store._data = new Map([
        [record1.key, record1],
        [record2.key, record2],
        [record3.key, record3],
        [record4.key, record4],
        [record5.key, record5],
        [record6.key, record6],
        [record7.key, record7],
        [record8.key, record8],
      ]);
    });

    context('when passed day before day1', () => {
      test('should return prev === undefined and next === record1', () => {
        const { prev, next } = store.getNeighbours(day1.prev());

        expect(prev).toBeUndefined();
        expect(next).toBe(record1);
      });
    });

    context('when passed day1', () => {
      test('should return prev === undefined and next === record2', () => {
        const { prev, next } = store.getNeighbours(day1);

        expect(prev).toBeUndefined();
        expect(next).toBe(record2);
      });
    });

    context('when passed day2', () => {
      test('should return prev === record1 and next === record3', () => {
        const { prev, next } = store.getNeighbours(day2);

        expect(prev).toBe(record1);
        expect(next).toBe(record3);
      });
    });

    context('when passed day3', () => {
      test('should return prev === record2 and next === record4', () => {
        const { prev, next } = store.getNeighbours(day3);

        expect(prev).toBe(record2);
        expect(next).toBe(record4);
      });
    });

    context('when passed day4', () => {
      test('should return prev === record3 and next === record5', () => {
        const { prev, next } = store.getNeighbours(day4);

        expect(prev).toBe(record3);
        expect(next).toBe(record5);
      });
    });

    context('when passed day5', () => {
      test('should return prev === record4 and next === record6', () => {
        const { prev, next } = store.getNeighbours(day5);

        expect(prev).toBe(record4);
        expect(next).toBe(record6);
      });
    });

    context('when passed day6', () => {
      test('should return prev === record5 and next === record7', () => {
        const { prev, next } = store.getNeighbours(day6);

        expect(prev).toBe(record5);
        expect(next).toBe(record7);
      });
    });

    context('when passed day7', () => {
      test('should return prev === record6 and next === record8', () => {
        const { prev, next } = store.getNeighbours(day7);

        expect(prev).toBe(record6);
        expect(next).toBe(record8);
      });
    });

    context('when passed day8', () => {
      test('should return prev === record7 and next === undefined', () => {
        const { prev, next } = store.getNeighbours(day8);

        expect(prev).toBe(record7);
        expect(next).toBeUndefined();
      });
    });

    context('when passed late than day8', () => {
      test('should return prev === record7 and next === undefined', () => {
        const { prev, next } = store.getNeighbours(day8.next());

        expect(prev).toBe(record8);
        expect(next).toBeUndefined();
      });
    });
  });

  describe('#add', () => {
    context('when add one record', () => {
      test('should add record without prev/next', () => {
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

    context('when add two records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value2, day2);
        store.add(value1, day1);

        const record1 = store.get(day1);
        const record2 = store.get(day2);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBeUndefined();
      });
    });

    context('when add three records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value2, day2);
        store.add(value1, day1);
        store.add(value3, day3);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBeUndefined();
      });
    });

    context('when add four records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value2, day2);
        store.add(value1, day1);
        store.add(value4, day4);
        store.add(value3, day3);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);
        const record4 = store.get(day4);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBeUndefined();
      });
    });

    context('when add five records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value3, day3);
        store.add(value1, day1);
        store.add(value4, day4);
        store.add(value2, day2);
        store.add(value5, day5);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);
        const record4 = store.get(day4);
        const record5 = store.get(day5);

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

    context('when add six records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value3, day3);
        store.add(value1, day1);
        store.add(value4, day4);
        store.add(value2, day2);
        store.add(value5, day5);
        store.add(value6, day6);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);
        const record4 = store.get(day4);
        const record5 = store.get(day5);
        const record6 = store.get(day6);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record5);
        expect(record5.prev).toBe(record4);
        expect(record5.next).toBe(record6);
        expect(record6.prev).toBe(record5);
        expect(record6.next).toBeUndefined();
      });
    });

    context('when add seven records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value3, day3);
        store.add(value1, day1);
        store.add(value4, day4);
        store.add(value7, day7);
        store.add(value2, day2);
        store.add(value5, day5);
        store.add(value6, day6);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);
        const record4 = store.get(day4);
        const record5 = store.get(day5);
        const record6 = store.get(day6);
        const record7 = store.get(day7);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record5);
        expect(record5.prev).toBe(record4);
        expect(record5.next).toBe(record6);
        expect(record6.prev).toBe(record5);
        expect(record6.next).toBe(record7);
        expect(record7.prev).toBe(record6);
        expect(record7.next).toBeUndefined();
      });
    });

    context('when add eight records', () => {
      test('should add records and sets prev/next', () => {
        store.add(value8, day8);
        const record8 = store.get(day8);
        expect(record8.prev).toBeUndefined();
        expect(record8.next).toBeUndefined();

        store.add(value3, day3);
        const record3 = store.get(day3);
        expect(record3.prev).toBeUndefined();
        expect(record3.next).toBe(record8);
        expect(record8.prev).toBe(record3);
        expect(record8.next).toBeUndefined();

        store.add(value1, day1);
        const record1 = store.get(day1);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record3);
        expect(record3.prev).toBe(record1);
        expect(record3.next).toBe(record8);
        expect(record8.prev).toBe(record3);
        expect(record8.next).toBeUndefined();

        store.add(value4, day4);
        const record4 = store.get(day4);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record3);
        expect(record3.prev).toBe(record1);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record8);
        expect(record8.prev).toBe(record4);
        expect(record8.next).toBeUndefined();

        store.add(value7, day7);
        const record7 = store.get(day7);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record3);
        expect(record3.prev).toBe(record1);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record7);
        expect(record7.prev).toBe(record4);
        expect(record7.next).toBe(record8);
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();

        store.add(value2, day2);
        const record2 = store.get(day2);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record7);
        expect(record7.prev).toBe(record4);
        expect(record7.next).toBe(record8);
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();

        store.add(value5, day5);
        const record5 = store.get(day5);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record5);
        expect(record5.prev).toBe(record4);
        expect(record5.next).toBe(record7);
        expect(record7.prev).toBe(record5);
        expect(record7.next).toBe(record8);
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();

        store.add(value6, day6);
        const record6 = store.get(day6);
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record5);
        expect(record5.prev).toBe(record4);
        expect(record5.next).toBe(record6);
        expect(record6.prev).toBe(record5);
        expect(record6.next).toBe(record7);
        expect(record7.prev).toBe(record6);
        expect(record7.next).toBe(record8);
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();
      });
    });

    context('when add another eight records', () => {
      test('should add records and sets prev/next', () => {
        // store.add(value8, day8);
        // store.add(value7, day7);
        store.add(value6, day6);
        store.add(value5, day5);
        store.add(value4, day4);
        store.add(value3, day3);
        store.add(value2, day2);
        store.add(value1, day1);

        const record1 = store.get(day1);
        const record2 = store.get(day2);
        const record3 = store.get(day3);
        const record4 = store.get(day4);
        const record5 = store.get(day5);
        const record6 = store.get(day6);
        // const record7 = store.get(day7);
        // const record8 = store.get(day8);

        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);
        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record3);
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);
        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record5);
        expect(record5.prev).toBe(record4);
        expect(record5.next).toBe(record6);
        expect(record6.prev).toBe(record5);
        expect(record6.next).toBeUndefined();
        // expect(record6.next).toBe(record7);
        // expect(record7.prev).toBe(record6);
        // expect(record7.next).toBe(record8);
        // expect(record8.prev).toBe(record7);
        // expect(record8.next).toBeUndefined();
      });
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
      record6 = store.get(day6);
      record7 = store.get(day7);
      record8 = store.get(day8);

      expect(record1.prev).toBeUndefined();
      expect(record1.next).toBe(record2);
      expect(record2.prev).toBe(record1);
      expect(record2.next).toBe(record3);
      expect(record3.prev).toBe(record2);
      expect(record3.next).toBe(record4);
      expect(record4.prev).toBe(record3);
      expect(record4.next).toBe(record5);
      expect(record5.prev).toBe(record4);
      expect(record5.next).toBe(record6);
      expect(record6.prev).toBe(record5);
      expect(record6.next).toBe(record7);
      expect(record7.prev).toBe(record6);
      expect(record7.next).toBe(record8);
      expect(record8.prev).toBe(record7);
      expect(record8.next).toBeUndefined();
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
      record6 = store.get(day6);
      record7 = store.get(day7);
      record8 = store.get(day8);
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
        store.delete(day4);

        expect(record4.isStored).toBeFalsy();
        expect(record4.next).toBeUndefined();
        expect(record4.prev).toBeUndefined();
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record5);
        expect(record5.prev).toBe(record3);
        expect(record5.next).toBe(record6);
      });
    });

    context('when delete last record from store', () => {
      test('should set isStored-prop of last record to false and re-set prev/next', () => {
        store.delete(day8);

        expect(record8.isStored).toBeFalsy();
        expect(record8.next).toBeUndefined();
        expect(record8.prev).toBeUndefined();
        expect(record7.prev).toBe(record6);
        expect(record7.next).toBeUndefined();
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      store.set(recordsToUpdate);

      record2 = store.get(day2);
      record4 = store.get(day4);
      record5 = store.get(day5);
      record7 = store.get(day7);
    });

    context('when update first record to be last', () => {
      test('should update store and re-set prev/next', () => {
        store.update(day2, value8, day8);
        record8 = store.get(day8);

        expect(record2.isStored).toBeFalsy();
        expect(record2.prev).toBeUndefined();
        expect(record2.next).toBeUndefined();

        expect(record8.isStored).toBeTruthy();
        expect(record8.isLast).toBeTruthy();
        expect(record8.prev).toBe(record7);
        expect(record8.next).toBeUndefined();

        expect(record4.prev).toBeUndefined();
        expect(record4.next).toBe(record5);

        expect(record7.prev).toBe(record5);
        expect(record7.next).toBe(record8);
      });
    });

    context('when update last record to be first', () => {
      test('should update store and re-set prev/next', () => {
        store.update(day7, value1, day1);
        record1 = store.get(day1);

        expect(record7.isStored).toBeFalsy();
        expect(record7.prev).toBeUndefined();
        expect(record7.next).toBeUndefined();
        expect(record7.isLast).toBeFalsy();

        expect(record1.isStored).toBeTruthy();
        expect(record1.prev).toBeUndefined();
        expect(record1.next).toBe(record2);

        expect(record5.prev).toBe(record4);
        expect(record5.next).toBeUndefined();
        expect(record5.isLast).toBeTruthy();

        expect(record2.prev).toBe(record1);
        expect(record2.next).toBe(record4);
      });
    });

    context('when update second record to be pre-last', () => {
      test('should update store and re-set prev/next', () => {
        store.update(day4, value6, day6);
        record6 = store.get(day6);

        expect(record4.isStored).toBeFalsy();
        expect(record4.prev).toBeUndefined();
        expect(record4.next).toBeUndefined();

        expect(record6.isStored).toBeTruthy();
        expect(record6.prev).toBe(record5);
        expect(record6.next).toBe(record7);

        expect(record2.prev).toBeUndefined();
        expect(record2.next).toBe(record5);

        expect(record5.prev).toBe(record2);
        expect(record5.next).toBe(record6);

        expect(record7.prev).toBe(record6);
        expect(record7.next).toBeUndefined();
      });
    });

    context('when update pre-laste record to second', () => {
      test('should update store and re-set prev/next', () => {
        store.update(day5, value3, day3);
        record3 = store.get(day3);

        expect(record5.isStored).toBeFalsy();
        expect(record5.prev).toBeUndefined();
        expect(record5.next).toBeUndefined();

        expect(record3.isStored).toBeTruthy();
        expect(record3.prev).toBe(record2);
        expect(record3.next).toBe(record4);

        expect(record4.prev).toBe(record3);
        expect(record4.next).toBe(record7);

        expect(record2.prev).toBeUndefined();
        expect(record2.next).toBe(record3);

        expect(record7.prev).toBe(record4);
        expect(record7.next).toBeUndefined();
      });
    });
  });
});

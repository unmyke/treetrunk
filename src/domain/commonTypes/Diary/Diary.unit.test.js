import { Diary } from './Diary';
import { BaseValue } from '../../_lib';
import { Day } from '../Day';

class MockItem extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }
}

const day1 = new Day({ value: new Date('2017.01.20') });
const day2 = new Day({ value: new Date('2017.02.20') });
const day3 = new Day({ value: new Date('2017.03.20') });
const day4 = new Day({ value: new Date('2017.04.20') });
const day5 = new Day({ value: new Date('2017.05.20') });
const day6 = new Day({ value: new Date('2017.06.20') });
const day7 = new Day({ value: new Date('2017.07.20') });

const closeValue = new MockItem({ value: 'close' });

const item1 = new MockItem({ value: 1, day: day1 });
const item2 = new MockItem({ value: 2, day: day2 });
const closeItem = new MockItem({ value: closeValue, day: day4 });
const item3 = new MockItem({ value: 3, day: day6 });

const itemWithSameDay = new MockItem({ value: 4, day: item3.day });
const itemWithSameValue = new MockItem({ value: item3.value, day: day7 });

const item = new MockItem({ value: 5, day: day5 });

const closedItems = [item1, item2, closeItem];
const items = [item1, item2, closeItem, item3];

let coll;
let result;

describe('Domain :: lib :: Diary', () => {
  beforeEach(() => {
    coll = new Diary({ closeValue });
  });

  context('when passed not close item', () => {
    context('when items is empty', () => {
      context('when initialized', () => {
        test('should items be empty', () => {
          expect(coll.items).toHaveLength(0);
          expect(coll.hasItems).toBe(false);
        });

        test('should have item value undefined', () => {
          expect(coll.itemValue).toBeUndefined();
        });

        test('should have start day undefined', () => {
          expect(coll.startDay).toBeUndefined();
        });

        test('should have close day undefined', () => {
          expect(coll.closeDay).toBeUndefined();
        });

        test('should be at idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#add', () => {
        beforeEach(() => {
          result = coll.addItem(item1);
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, errors: {} });
        });

        test('should fill items', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([item1]);
          expect(coll.items).toHaveLength(1);
        });

        test('should set added item value', () => {
          expect(coll.itemValue).toBe(item1.value);
        });

        test('should set start day', () => {
          expect(coll.startDay).toBe(item1.day);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#delete', () => {
        beforeEach(() => {
          result = coll.deleteItem(item1);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            errors: { item: ['Item not found'] },
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#edit', () => {
        beforeEach(() => {
          result = coll.editItem(item1, item2);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            errors: {
              item: ['Item not found'],
            },
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#set', () => {
        beforeEach(() => {
          result = coll.setItems(items);
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, errors: {} });
        });

        test('should fill items', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([items[3]]);
          expect(coll.items).toHaveLength(1);
        });

        test('should set added item value', () => {
          expect(coll.itemValue).toBe(items[3].value);
        });

        test('should set start day', () => {
          expect(coll.itemValue).toBe(items[3].day);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });
    });

    context('when items is not empty', () => {
      beforeEach(() => {
        coll.setItems(items);
      });

      context('when initialized', () => {
        test('should items be filled', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([items[3]]);
          expect(coll.items).toHaveLength(1);
        });

        test('should have item value not undefined', () => {
          expect(coll.itemValue).toBe(items[3].value);
        });

        test('should have start day', () => {
          expect(coll.startDay).toBe(items[3].day);
        });

        test('should be at idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#add', () => {
        context('when item already exists at passed day', () => {
          test('should return unsuccessful result', () => {
            expect(coll.addItem(itemWithSameDay)).toEqual({
              done: false,
              errors: { item: ['Item already exists'] },
            });
          });

          test('should leave items unchanged', () => {
            expect(coll.hasItems).toBe(true);
            expect(coll.items).toEqual([item4]);
            expect(coll.items).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });

        context('when no item exists at passed day', () => {
          context('when passed item value is the same as persisted', () => {
            beforeEach(() => {
              result = coll.addItem(itemWithSameValue);
            });

            test('should return unsuccessful result', () => {
              expect(result).toEqual({
                done: false,
                errors: { item: ['Item already have this value'] },
              });
            });

            test('should leave items unchanged', () => {
              expect(coll.hasItems).toBe(true);
              expect(coll.items).toEqual([items[3]]);
              expect(coll.items).toHaveLength(1);
            });

            test('should return to idle state', () => {
              expect(coll.state).toBe('idle');
            });
          });

          context('when passed item value is not the same as persisted', () => {
            context('when passed day is sooner than start day', () => {
              context('when close exists at passed day', () => {
                context('when passed day is sooner than close day', () => {
                  beforeEach(() => {
                    coll.addItem({
                      value: 3,
                      day: day3,
                    });
                  });

                  test('should return unsuccessful result', () => {
                    expect(result).toEqual({
                      done: false,
                      errors: { item: ['Item already have this value'] },
                    });
                  });

                  test('should leave items unchanged', () => {
                    expect(coll.hasItems).toBe(true);
                    expect(coll.items).toEqual([item4]);
                    expect(coll.items).toHaveLength(1);
                  });

                  test('should return to idle state', () => {
                    expect(coll.state).toBe('idle');
                  });
                });
                context('when passed day is later than close day', () => {
                  beforeEach(() => {
                    result = coll.addItem(
                      new MockItem({
                        value: 4,
                        day: day5,
                      })
                    );
                  });

                  test('should return successful result', () => {
                    expect(result).toEqual({
                      done: true,
                      errors: {},
                    });
                  });

                  test('should change items', () => {
                    expect(coll.getItemsAt(day6)).toBe([
                      {
                        value: 4,
                        day: day5,
                      },
                      item4,
                    ]);
                  });

                  test('should change start day', () => {
                    expect(coll.getStartDayAt(day6)).toBe(day4);
                  });
                });
              });

              context('when close not exists at passed day', () => {
                beforeEach(() => {
                  result = coll.addItem(
                    new MockItem({
                      value: 4,
                      day: day4,
                    })
                  );
                });

                test('should return successful result', () => {
                  expect(result).toEqual({
                    done: true,
                    errors: {},
                  });
                });

                test('should change items', () => {
                  expect(coll.getItemsAt(day6)).toBe([
                    {
                      value: 4,
                      day: day4,
                    },
                    item4,
                  ]);
                });

                test('should change start day', () => {
                  expect(coll.getStartDayAt(day6)).toBe(day4);
                });
              });
            });

            context('when passed day is later than start day', () => {
              test('should return successful result', () => {
                expect(
                  coll.addItem(
                    new MockItem({
                      value: 3,
                      day: day0,
                    })
                  )
                ).toEqual({
                  done: true,
                  errors: {},
                });
                expect(coll.getStartDayAt(day0)).toBe(day0);
              });
            });
          });
        });
      });

      describe('#delete', () => {
        context('when item already exists at passed day', () => {
          context('when previous and next item values are the same', () => {});

          context(
            'when previous and next item values are not the same',
            () => {}
          );
        });

        context('when no item exists at passed day', () => {
          beforeEach(() => {
            result = coll.deleteItem(
              new MockItem({
                value: 5,
                day: day4,
              })
            );
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              errors: { item: ['Item not found'] },
            });
          });

          test('should leave items unchanged', () => {
            expect(coll.hasItems).toBe(true);
            expect(coll.items).toEqual([item4]);
            expect(coll.items).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });
      });

      describe('#edit', () => {
        context('when item already exists at passed day', () => {});

        context('when no item exists at passed day', () => {});
      });

      describe('#set', () => {});
    });

    context('when items is closed', () => {
      beforeEach(() => {
        coll.setItems(closedItems);
      });

      context('when initialized', () => {
        test('should items be empty', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toBe([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should have item value undefined', () => {
          expect(coll.itemValue).toBeUndefined();
        });

        test('should have no start day', () => {
          expect(coll.startDay).toBeUndefined();
        });

        test('should be at idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#add', () => {
        context('when passed close item', () => {
          beforeEach(() => {
            result = coll.addItem(closeItem);
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              errors: [
                `Mock item with value "${
                  closeItem.value
                }" at 20.01.2017 already exists`,
              ],
            });
          });

          test('should leave items unchanged', () => {
            expect(coll.hasItems).toBe(false);
            expect(coll.items).toEqual([]);
            expect(coll.items).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });

        context('when passed not close item', () => {
          beforeEach(() => {
            result = coll.addItem(item4);
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, errors: {} });
          });

          test('should fill items', () => {
            expect(coll.hasItems).toBe(true);
            expect(coll.items).toEqual([item4]);
            expect(coll.items).toHaveLength(1);
          });

          test('should set added item value', () => {
            expect(coll.itemValue).toBe(item4.value);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });
      });

      describe('#delete', () => {
        context('when close item exists at passed day', () => {
          beforeEach(() => {
            result = coll.deleteItem(closeItem);
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, errors: {} });
          });

          test('should restore items', () => {
            expect(coll.hasItems).toBe(true);
            expect(coll.items).toEqual([item1, item2]);
            expect(coll.items).toHaveLength(2);
          });

          test('should set added item value', () => {
            expect(coll.itemValue).toBe(item2.value);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });

        context('when no close item exists at passed day', () => {
          beforeEach(() => {
            result = coll.deleteItem(
              new MockItem({
                value: closeValue,
                day: day4,
              })
            );
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              errors: ['Mock item with value "close" at 20.04.2017 not found'],
            });
          });

          test('should leave items unchanged', () => {
            expect(coll.hasItems).toBe(false);
            expect(coll.items).toEqual([]);
            expect(coll.items).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(coll.state).toBe('idle');
          });
        });
      });

      describe('#edit', () => {
        beforeEach(() => {
          result = coll.editItem(closeItem, closeItem);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            errors: ['Mock items for edit not exist'],
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      describe('#set', () => {});
    });
  });

  context('when passed close item', () => {
    describe('#add', () => {
      beforeEach(() => {
        result = coll.addItem(closeItem);
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          errors: ['Close item not allowed by add method'],
        });
      });

      test('should leave items unchanged', () => {
        expect(coll.hasItems).toBe(false);
        expect(coll.items).toEqual([]);
        expect(coll.items).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#delete', () => {
      beforeEach(() => {
        result = coll.deleteItem(closeItem);
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          errors: ['Close item not allowed by delete method'],
        });
      });

      test('should leave items unchanged', () => {
        expect(coll.hasItems).toBe(false);
        expect(coll.items).toEqual([]);
        expect(coll.items).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#edit', () => {
      context('when passed as item to edit', () => {
        beforeEach(() => {
          result = coll.editItem(closeItem);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            errors: {
              item: ['Close item not allowed by edit method'],
            },
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      context('when passed as new item', () => {
        beforeEach(() => {
          result = coll.editItem(closeItem1);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            errors: {
              newItem: ['Close item not allowed by edit method'],
            },
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });
    });
  });
});

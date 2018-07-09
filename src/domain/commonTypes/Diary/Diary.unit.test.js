import { Diary } from './Diary';
import { BaseValue } from '../../_lib';
import { Day } from '../Day';
import { errors } from '../../errors';

class MockRecord extends BaseValue {
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
const day8 = new Day({ value: new Date('2017.08.20') });
const day9 = new Day({ value: new Date('2017.09.20') });

const closeValue = new MockRecord({ value: 'close' });

const record1 = new MockRecord({ value: 1, day: day1 });
const record2 = new MockRecord({ value: 2, day: day2 });
const closeRecord = new MockRecord({ value: closeValue, day: day4 });
const record3 = new MockRecord({ value: 3, day: day7 });

const records = [record1, record2, closeRecord, record3];
// add
const recordWithSameDay1 = new MockRecord({ value: 4, day: record3.day });
const recordWithSameValue = new MockRecord({ value: record3.value, day: day7 });

const nonExistentRecord = new MockRecord({
  value: 5,
  day: day5,
});
const pastRecord = new MockRecord({ value: 5, day: day3 });

const forgottenRecord = new MockRecord({ value: 5, day: day6 });
const newRecord = new MockRecord({ value: 5, day: day9 });

//update
const recordWithSameDay2 = new MockRecord({ value: 9, day: newRecord.day });

const plannedRecord1 = new MockRecord({ value: newRecord.value, day: day8 });
const plannedRecord2 = new MockRecord({ value: record3.value, day: day8 });
const plannedRecord3 = new MockRecord({ value: 8, day: day8 });

let diary;
let result;

describe('Domain :: lib :: Diary', () => {
  beforeEach(() => {
    diary = new Diary({ closeValue, RecordClass: MockRecord });
  });

  context('when passed regular record', () => {
    context('when diary is not started', () => {
      context('when initialized', () => {
        test('should records be empty', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.hasRecords).toBe(false);
        });

        test('should have record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should have start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should have close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#add', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: record1 });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record1]);
          expect(diary.records).toHaveLength(1);
        });

        test('should set added record value', () => {
          expect(diary.recordValue).toBe(record1.value);
        });

        test('should set start day', () => {
          expect(diary.startDay).toBe(record1.day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#delete', () => {
        beforeEach(() => {
          result = diary.deleteRecord({ record: record1 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { mockRecord: [errors.diaryNotStarted().message] },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#update', () => {
        beforeEach(() => {
          result = diary.updateRecord({ record: record1, newRecord: record2 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newMockRecord: [],
              mockRecord: [errors.diaryNotStarted().message],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#set', () => {
        beforeEach(() => {
          result = diary.setRecords({ newRecords: records });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([records[3]]);
          expect(diary.records).toHaveLength(1);
        });

        test('should set record value equal last element', () => {
          expect(diary.recordValue).toBe(records[3].value);
        });

        test('should set start day', () => {
          expect(diary.recordDay).toBe(records[3].day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });
    });

    context('when diary is started', () => {
      beforeEach(() => {
        diary.setRecords({ newRecords: records });
      });

      context('when initialized', () => {
        test('should records be filled', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([records[3]]);
          expect(diary.records).toHaveLength(1);
        });

        test('should have record value not undefined', () => {
          expect(diary.recordValue).toBe(records[3].value);
        });

        test('should have start day', () => {
          expect(diary.startDay).toBe(records[3].day);
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#addRecord', () => {
        context('when diary already have record at passed day', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: recordWithSameDay1 });
          });
          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { mockRecord: [errors.recordAlreadyExists().message] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary already have record with passed value', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: recordWithSameValue });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { mockRecord: [errors.recordDuplicate().message] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed record to closed diary', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: pastRecord });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { mockRecord: [errors.diaryClosed().message] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary has been closed', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: forgottenRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({
              done: true,
              error: null,
            });
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([forgottenRecord, record3]);
            expect(diary.records).toHaveLength(2);
          });

          test('should leave record value unchanged', () => {
            expect(diary.recordValue).toBe(record3.value);
          });

          test('should change start day', () => {
            expect(diary.startDay).toBe(forgottenRecord.day);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed new record', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: newRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({
              done: true,
              error: null,
            });
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3, newRecord]);
            expect(diary.records).toHaveLength(2);
          });

          test('should change record value', () => {
            expect(diary.recordValue).toBe(newRecord.value);
          });

          test('should leave start day unchanged', () => {
            expect(diary.startDay).toBe(record3.day);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#deleteRecord', () => {
        context('when passed non-existent record', () => {
          beforeEach(() => {
            result = diary.deleteRecord({ record: nonExistentRecord });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                mockRecord: [errors.recordNotFound().message],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed existing record', () => {
          beforeEach(() => {
            diary.setRecords({
              newRecords: [forgottenRecord, newRecord],
            });
          });

          context('when initialized', () => {
            test('should match given conditions', () => {
              expect(diary.getRecordValueAt(forgottenRecord.day)).toEqual(
                diary.getRecordValueAt(newRecord.day)
              );
            });
          });

          context('when next and previous record values are similar', () => {
            beforeEach(() => {
              result = diary.deleteRecord({ record: record3 });
            });

            test('should return unsuccessful result', () => {
              expect(result).toEqual({
                done: false,
                error: {
                  mockRecord: [errors.recordHasEqualNeightbors().message],
                },
              });
            });

            test('should leave records unchanged', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                forgottenRecord,
                record3,
                newRecord,
              ]);
              expect(diary.records).toHaveLength(3);
            });

            test('should return to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });

          context('when next and previous record values are different', () => {
            beforeEach(() => {
              result = diary.deleteRecord({ record: newRecord });
            });

            test('should return successful result', () => {
              expect(result).toEqual({
                done: true,
                error: null,
              });
            });

            test('should change records', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([forgottenRecord, record3]);
              expect(diary.records).toHaveLength(2);
            });

            test('should change record value', () => {
              expect(diary.recordValue).toBe(record3.value);
            });

            test('should leave start day unchanged', () => {
              expect(diary.startDay).toBe(forgottenRecord.day);
            });

            test('should return to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });
        });

        context('when passed record of closed diary', () => {
          beforeEach(() => {
            result = diary.deleteRecord({ record: record2 });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                mockRecord: [errors.diaryClosed().message],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#updateRecord', () => {
        context('when change non-existent record', () => {
          beforeEach(() => {
            result = diary.updateRecord({
              record: nonExistentRecord,
              newRecord: newRecord,
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [],
                mockRecord: [errors.recordNotFound().message],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when change existing record', () => {
          beforeEach(() => {
            diary.setRecords({
              newRecords: [forgottenRecord, newRecord],
            });
          });

          context('when initialized', () => {
            test('should match given conditions', () => {
              expect(diary.getRecordValueAt(forgottenRecord.day)).toEqual(
                diary.getRecordValueAt(newRecord.day)
              );
            });
          });

          context('when diary already have record at updated day', () => {
            beforeEach(() => {
              result = diary.updateRecord({
                record: record3,
                newRecord: recordWithSameDay2,
              });
            });

            test('should return unsuccessful result', () => {
              expect(result).toEqual({
                done: false,
                error: {
                  newMockRecord: [],
                  mockRecord: [errors.recordAlreadyExists().message],
                },
              });
            });

            test('should leave records unchanged', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                forgottenRecord,
                record3,
                newRecord,
              ]);
              expect(diary.records).toHaveLength(3);
            });

            test('should return to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });
          context('when next and previous record leave unchanged', () => {
            context('when new value is similar', () => {
              beforeEach(() => {
                result = diary.updateRecord({
                  record: record3,
                  newRecord: plannedRecord1,
                });
              });

              test('should return unsuccessful result', () => {
                expect(result).toEqual({
                  done: false,
                  error: {
                    newMockRecord: [],
                    mockRecord: [errors.recordDuplicate().message],
                  },
                });
              });

              test('should leave records unchanged', () => {
                expect(diary.hasRecords).toBe(true);
                expect(diary.records).toEqual([
                  forgottenRecord,
                  record3,
                  newRecord,
                ]);
                expect(diary.records).toHaveLength(3);
              });

              test('should return to idle state', () => {
                expect(diary.state).toBe('idle');
              });
            });

            context('when new value leave unchanged or different', () => {
              beforeEach(() => {
                result = diary.updateRecord({
                  record: record3,
                  newRecord: plannedRecord2,
                });
              });

              test('should return successful result', () => {
                expect(result).toEqual({ done: true, error: null });
              });

              test('should change records', () => {
                expect(diary.hasRecords).toBe(true);
                expect(diary.records).toEqual([
                  forgottenRecord,
                  plannedRecord2,
                  newRecord,
                ]);
                expect(diary.records).toHaveLength(3);
              });

              test('should change record value of updated record', () => {
                expect(diary.getRecordValueAt(plannedRecord2.day)).toBe(
                  plannedRecord2.value
                );
              });

              test('should return to idle state', () => {
                expect(diary.state).toBe('idle');
              });
            });
          });

          context('next and previous record values change', () => {
            context('when new value is similar', () => {
              beforeEach(() => {
                result = diary.updateRecord({
                  record: forgottenRecord,
                  newRecord: plannedRecord1,
                });
              });

              test('should return unsuccessful result', () => {
                expect(result).toEqual({
                  done: false,
                  error: {
                    newMockRecord: [],
                    mockRecord: [errors.recordDuplicate().message],
                  },
                });
              });

              test('should leave records unchanged', () => {
                expect(diary.hasRecords).toBe(true);
                expect(diary.records).toEqual([
                  forgottenRecord,
                  record3,
                  newRecord,
                ]);
                expect(diary.records).toHaveLength(3);
              });

              test('should return to idle state', () => {
                expect(diary.state).toBe('idle');
              });
            });

            context('when new value is different', () => {
              beforeEach(() => {
                result = diary.updateRecord({
                  record: forgottenRecord,
                  newRecord: plannedRecord3,
                });
              });

              test('should return successful result', () => {
                expect(result).toEqual({ done: true, error: null });
              });

              test('should change records', () => {
                expect(diary.hasRecords).toBe(true);
                expect(diary.records).toEqual([
                  record3,
                  plannedRecord3,
                  newRecord,
                ]);
                expect(diary.records).toHaveLength(3);
              });

              test('should change start day', () => {
                expect(diary.startDay).toBe(record3.day);
              });

              test('should change record value of updated record', () => {
                expect(diary.getRecordValueAt(plannedRecord3.day)).toBe(
                  plannedRecord3.value
                );
              });

              test('should return to idle state', () => {
                expect(diary.state).toBe('idle');
              });
            });
          });
        });

        context('when change record of closed diary', () => {
          beforeEach(() => {
            result = diary.updateRecord({
              record: record2,
              newRecord: newRecord,
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [],
                mockRecord: [errors.diaryClosed().message],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#setRecords', () => {});
    });
  });

  context('when passed close record', () => {
    context('when diary is not started', () => {
      context('when initialized', () => {
        test('should records be empty', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.hasRecords).toBe(false);
        });

        test('should have record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should have start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should have close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#addCloseRecord', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: closeRecord });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotStarted().message],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#deleteCloseRecord', () => {
        beforeEach(() => {
          result = diary.deleteRecord({ record: closeRecord });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotClosed().message],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#updateCloseRecord', () => {
        context('when passed as record to update', () => {
          beforeEach(() => {
            result = diary.updateRecord({
              record: closeRecord,
              newRecord: record1,
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [],
                mockRecord: [errors.diaryNotClosed().message],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([]);
            expect(diary.records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed as new record', () => {
          beforeEach(() => {
            result = diary.updateRecord({
              record: closeRecord,
              newRecord: record1,
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [errors.closeRecordAccessDenied],
                mockRecord: [],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([]);
            expect(diary.records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });
    });

    context('when diary is started', () => {
      beforeEach(() => {
        diary.setRecords({ newRecords: records });
      });

      context('when initialized', () => {
        test('should diary be started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#addCloseRecord', () => {
        context('when passed as last record', () => {
          beforeEach(() => {
            result = diary.addCloseRecord(day8);
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should close diary', () => {
            expect(diary.isClosed).toBe(true);
            expect(diary.isStarted).toBe(false);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed not as last record', () => {
          beforeEach(() => {
            result = diary.addCloseRecord(day5);
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                mockRecord: [errors.diaryHasRecordsLater().message],
              },
            });
          });

          test('should leave diary started', () => {
            expect(diary.isStarted).toBe(true);
            expect(diary.isClosed).toBe(false);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#deleteCloseRecord', () => {
        beforeEach(() => {
          result = diary.deleteCloseRecord();
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotClosed().message],
            },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
          expect(diary.isClosed).toBe(false);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#updateCloseRecord', () => {
        context('when passed as last record', () => {});

        context('when passed as new record', () => {});
      });
    });
  });
});

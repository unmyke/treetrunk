export function isInLimitedScopePredicate(operatee, { record, newRecord }) {
  const prevRecordForRecord = operatee.getPrevRecordAt(record.day);
  const prevRecordForNewRecord = operatee.getPrevRecordAt(newRecord.day, {
    excludeRecords: [record],
  });

  return (
    prevRecordForRecord !== undefined &&
    prevRecordForRecord.equals(prevRecordForNewRecord)
  );
}

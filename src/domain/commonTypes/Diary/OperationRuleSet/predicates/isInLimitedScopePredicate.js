export function isInLimitedScopePredicate(operatee, { record, newRecord }) {
  const prevRecordForRecord = operatee.getPrevRecord(record);
  const prevRecordForNewRecord = operatee.getPrevRecord(newRecord, {
    excludeRecords: [record],
  });

  return (
    prevRecordForRecord !== undefined &&
    prevRecordForRecord.equals(prevRecordForNewRecord)
  );
}

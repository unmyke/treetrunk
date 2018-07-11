export function isInLimitedScopePredicate({ record, newRecord }) {
  const prevRecordForRecord = this.operatee.getPrevRecord(record);
  const prevRecordForNewRecord = this.operatee.getPrevRecord(newRecord, {
    excludeRecords: [record],
  });

  return (
    prevRecordForRecord !== undefined &&
    prevRecordForRecord.equals(prevRecordForNewRecord)
  );
}

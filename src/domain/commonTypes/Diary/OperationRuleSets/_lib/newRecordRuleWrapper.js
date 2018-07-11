export const newRecordRuleWrapper = (rule) => ({ record, newRecord }) => {
  rule(
    { record: newRecord },
    {
      excludeRecords: [record],
    }
  );
};

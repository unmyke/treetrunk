export const newRecordRuleWrapper = (rule) => {
  return {
    execute: function(operatee, { record, newRecord }) {
      rule.execute(
        operatee,
        { record: newRecord },
        {
          excludeRecords: [record],
        }
      );
    },
  };
};

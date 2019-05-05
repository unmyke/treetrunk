const DayMapper = ({ commonTypes }) => {
  const toDatabase = ({ value }) => value;
  const toEntity = (value) => new commonTypes.Day({ value: new Date(value) });

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default DayMapper;

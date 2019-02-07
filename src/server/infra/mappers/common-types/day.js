const DayMapper = ({ commonTypes }) => {
  const toDatabase = ({ value }) => {
    return value;
  };

  const toEntity = ({ value }) => {
    return new commonTypes.Day({ value: new Date(value) });
  };

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default DayMapper;

import { BaseMapper } from '../_lib';

const DayMapper = ({ commonTypes, Entity }) => {
  const baseMapper = BaseMapper({ commonTypes, Entity });

  const toDatabase = ({ value }) => {
    return value;
  };

  const toEntity = ({ value }) => {
    return new baseMapper.commonTypes.Day({ value: new Date(value) });
  };

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default DayMapper;

import BaseMapper from './base-mapper';

const BaseIdMapper = ({ Entity, commonTypes }) => {
  const baseMapper = BaseMapper({ Entity, commonTypes });

  const toDatabase = ({ value }) => value;
  const toEntity = ({ value }) =>
    new baseMapper.commonTypes[baseMapper.constructor.EntityIdName]({ value });

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default BaseIdMapper;

import getNestedContainerName from '../../get-nested-container-name';

const constant = ({ bottle, name }) => ([constantName, constant]) => {
  bottle.constant(getNestedContainerName(name, constantName), constant);
};
export default constant;

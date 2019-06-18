import getContainerName from './get-container-name';

const getNestedContainerFactory = ({ bottle, type }) => {
  const containerRegister = bottle[type].bind(bottle);

  return ({ name, containers }) => {
    Object.entries(containers).forEach(([containerName, container]) => {
      containerRegister(getContainerName(name, containerName), container);
    });
  };
};
export default getNestedContainerFactory;

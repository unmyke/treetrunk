import getNestedContainerFactory from './get-nested-container-factory';
import getContainerName from './get-container-name';

const getNestedContainersFactory = ({ bottle, type, name }) => {
  const createNestedContainer = getNestedContainerFactory({
    bottle,
    type,
  });

  return (containerMap) => {
    Object.entries(containerMap).forEach(
      ([internalContainerName, containers]) => {
        const containerName = getContainerName(name, internalContainerName);

        createNestedContainer({
          name: containerName,
          containers,
        });
      }
    );
  };
};
export default getNestedContainersFactory;

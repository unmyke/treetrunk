import getNestedContainerFactory from './get-nested-container-factory';
import getNestedContainerName from './get-nested-container-name';

const getNestedContainerFactories = ({ bottle, type, name }) => (
  containerMap
) => {
  return Object.entries(containerMap).forEach(
    ([internalContainerName, containers]) => {
      const containerName = getNestedContainerName(name, internalContainerName);

      const createNestedContainer = getNestedContainerFactory({
        bottle,
        type,
        name: containerName,
      });

      createNestedContainer(containers);
    }
  );
};
export default getNestedContainerFactories;

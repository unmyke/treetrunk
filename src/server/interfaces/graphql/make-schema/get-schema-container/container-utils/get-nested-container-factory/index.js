import * as nestedContainerCreators from './nested-container-creators';

const getNestedContainerFactory = ({ bottle, type, name, resolver }) => (
  containers
) => {
  Object.entries(containers).forEach(
    nestedContainerCreators[type]({ bottle, name, resolver })
  );
};
export default getNestedContainerFactory;

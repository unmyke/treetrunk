import * as nestedContainerCreators from './nested-container-creators';

const getNestedContainerFactory = ({ bottle, type, name }) => (containers) => {
  Object.entries(containers).forEach(
    nestedContainerCreators[type]({ bottle, name })
  );
};
export default getNestedContainerFactory;

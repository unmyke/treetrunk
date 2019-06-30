import getNestedContainerName from '../../get-nested-container-name';

const factory = ({ bottle, name }) => ([factoryName, factory]) => {
  bottle.provider(
    getNestedContainerName(name, factoryName),
    function nestedFactoryProvider() {
      this.$get = () => factory(bottle.container);
    }
  );
};
export default factory;

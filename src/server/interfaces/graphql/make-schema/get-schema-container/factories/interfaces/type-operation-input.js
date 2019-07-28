import { interfaceType } from 'nexus';

const TypeOperationInputInterface = () =>
  interfaceType({
    name: 'TypeOperationInputInterface',
    definition(t) {
      t.id('id', { required: true });
    },
  });
export default TypeOperationInputInterface;

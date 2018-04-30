import { Operation } from '../_lib/Operation';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';
import { POINT_CONVERSION_HYBRID } from 'constants';

export class InitializeApplication extends Operation {
  async execute({ config }) {
    const { repositories, entities } = this;
    const { SUCCESS, ERROR, INITIALIZE_ERROR } = this.outputs;

    try {
      config.seeds.forEach(async (seed) => {
        const { name, ModelName, values, callback } = seed;
        const {
          repositories: { [ModelName]: repo },
          entities: { [ModelName]: Entity },
        } = this;

        let model;

        await repo.getOne({ where: values }).then((v) => {
          model = v;
        });

        if (!model) {
          const newModel = new Entity(values);
          model = await repo.add(newModel);
        }

        const id = model[`${lowercaseFirstLetter(ModelName)}Id`];

        seed.callback(Entity, id);
      });
      this.emit(SUCCESS, true);
    } catch (error) {
      if (error.message === 'InitializeError') {
        return this.emit(INITIALIZE_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

InitializeApplication.setOutputs(['SUCCESS', 'ERROR', 'INITIALIZE_ERROR']);

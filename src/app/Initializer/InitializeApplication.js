import { Operation } from '../_lib/Operation';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class InitializeApplication extends Operation {
  async execute({ config }) {
    const { SUCCESS, ERROR, INITIALIZE_ERROR } = this.outputs;
    try {
      config.seeds.forEach(async function({ name, ModelName, values }) {
        const {
          repositories: { [seed[ModelName]]: repo },
          entities: { [seed[ModelName]]: Entity },
        } = this;

        let model;

        await repo.getOne({ where: seed.values }).then((v) => {
          model = v;
        });

        if (!model) {
          model = await repo.add(seed.values);
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

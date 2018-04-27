import { Operation } from '../_lib/Operation';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class Initializer extends Operation {
  async execute({ config }) {
    const { SUCCESS, ERROR, INITIALIZE_ERROR } = this.outputs;

    try {
      config.seeds.forEach(async ({ name, ModelName, values, callback }) => {
        const {
          repositories: { [ModelName]: modelRepo },
          entities: { [ModelName]: Model },
          commonTypes: { [`${ModelName}Id`]: ModelId },
        } = this;

        let model;

        await modelRepo.getOne({ where: values }).then((v) => {
          model = v;
        });

        if (!model) {
          const newModel = new Model(values);
          model = await modelRepo.add(newModel);
        }

        const id = model[`{lowercaseFirstLetter(ModelName)}Id`];

        callback(Id, id);
      });
      this.emit(SUCCESS, sellersDTO);
    } catch (error) {
      if (error.message === 'InitializeError') {
        return this.emit(INITIALIZE_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSellers.setOutputs(['SUCCESS', 'ERROR', 'INITIALIZE_ERROR']);

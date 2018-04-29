import EventEmitter from 'events';

export class Operation extends EventEmitter {
  static setOutputs(outputs) {
    Object.defineProperty(this.prototype, 'outputs', {
      value: createOutputs(outputs),
    });
  }

  constructor({
    repositories,
    domain: { services: domainServices, entities, commonTypes },
  }) {
    super();
    console.log(domainServices);
    console.log(entities);
    console.log(commonTypes);
    this.repositories = repositories;
    this.domainServices = domainServices;
    this.entities = entities;
    this.commonTypes = commonTypes;
  }

  on(output, handler) {
    if (this.outputs[output]) {
      return this.addListener(output, handler);
    }

    throw new Error(
      `Invalid output "${output}" to operation ${this.constructor.name}.`
    );
  }
}

const createOutputs = (outputsArray) =>
  outputsArray.reduce((obj, output) => ({ ...obj, [output]: output }), {});

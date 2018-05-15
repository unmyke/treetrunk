import EventEmitter from 'events';

export class Operation extends EventEmitter {
  static setOutputs(outputs) {
    Object.defineProperty(this.prototype, 'outputs', {
      value: createOutputs(outputs),
    });
  }

  constructor({
    commonTypes,
    entities,
    domainServices,
    validate,
    repositories,
    errorFactory,
  }) {
    super();
    this.commonTypes = commonTypes;
    this.entities = entities;
    this.domainServices = domainServices;
    this.repositories = repositories;
    this.validate = validate;
    this.errorFactory = errorFactory;
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

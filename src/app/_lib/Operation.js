import EventEmitter from 'events';

export class Operation extends EventEmitter {
  static setOutputs(outputs) {
    Object.defineProperty(this.prototype, 'outputs', {
      value: createOutputs(outputs),
    });
  }

  constructor({ repositories, domain, serializers }) {
    super();
    this.domain = domain;
    this.repositories = repositories;
    this.serializers = serializers;
  }

  on(output, handler) {
    if (this.outputs[output]) {
      return this.addListener(output, handler);
    }

    throw new Error(
      `Invalid output "${output}" to operation ${this.constructor.name}.`,
    );
  }
}

const createOutputs = (outputsArray) =>
  outputsArray.reduce((obj, output) => ({ ...obj, [output]: output }), {});

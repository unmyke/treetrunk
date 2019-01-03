// import('@babel/polyfill');
import EventEmitter from 'events';
import { container } from './container';

export class Server extends EventEmitter {
  start() {
    container.app.start().catch((error) => {
      this.emit('error', error);
    });
  }

  stop() {
    process.exit();
  }

  error(error) {
    app.logger.error(error.stack);
    this.emit('stop');
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

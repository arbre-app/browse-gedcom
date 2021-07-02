import * as Comlink from 'comlink';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker';

const worker = new Worker();
export const workerApi = Comlink.wrap(worker);

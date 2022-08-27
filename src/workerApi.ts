import * as Comlink from 'comlink';
import { ComlinkApi } from './worker';

const worker = new Worker(new URL('./worker', import.meta.url));
export const workerApi = Comlink.wrap<ComlinkApi>(worker);

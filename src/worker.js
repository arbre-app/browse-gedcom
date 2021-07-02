import { parseGedcom } from 'read-gedcom';
import * as Comlink from 'comlink';

const obj = {
    parseGedcom(buffer, progressCallback) {
        return parseGedcom(buffer, { progressCallback });
    }
};

Comlink.expose(obj);

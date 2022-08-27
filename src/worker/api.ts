import * as Comlink from 'comlink';
import { GedcomReadingPhase, parseGedcom, Tag, TreeNode } from 'read-gedcom';
import { db, FamilyRelationType, ModelGedcomFamilyIndex, ModelGedcomNode } from '../db';
import { randomBase32Id } from '../util';

// TODO duplicate pointer: not handled (will raise a db add error)

const api = {
  async createFamilyTree(file: File, progressCallback?: (phase: number, progress: number | null) => void) {
    const BULK_BATCH_SIZE = 1000;
    const INDEXEDDB_PHASE = GedcomReadingPhase.TokenizationAndStructuring + 2;

    const { name, size, lastModified, type } = file;
    const promise: Promise<number> = new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = e => {
        if (progressCallback && e.lengthComputable) {
          const progress = e.loaded / e.total;
          progressCallback(0, progress);
        }
      };
      if (progressCallback) {
        progressCallback(0, 0);
      }
      reader.onload = async () => {
        if (progressCallback) {
          progressCallback(0, 1);
        }
        const buffer = reader.result as ArrayBuffer;
        try {
          const gedcom = parseGedcom(buffer, { noIndex: true, progressCallback: progressCallback ? (phase, progress) => progressCallback(phase + 1, progress) : undefined });
          if (progressCallback) {
            progressCallback(INDEXEDDB_PHASE, 0);
          }
          const familyTreeId = await db.transaction("rw", db.familyTrees, db.gedcomFiles, db.gedcomNodes, db.gedcomFamilyIndex, async () => {
            const gedcomFileId = await db.gedcomFiles.add({
              fileMeta: { name, size, lastModified, type }
            });
            let displayId: string;
            while (true) {
              displayId = randomBase32Id(10);
              if ((await db.familyTrees.where('displayId').equals(displayId).toArray()).length === 0) { // Just as a safety precaution to prevent duplicate ids
                break;
              }
            }
            const familyTreeId = await db.familyTrees.add({
              displayId,
              gedcomFileId,
            });
            const linesBatches: ModelGedcomNode[][] = [[]];
            let currentLineBatch = linesBatches[0];
            const indexBatches: ModelGedcomFamilyIndex[][] = [[]];
            let currentIndexBatch = indexBatches[0];
            const queue: [TreeNode, number, number][] = [[gedcom, 0, -1]];
            while (queue.length > 0) {
              const pair = queue[queue.length - 1];
              const [node, nextChildIndex, parentLineNumber] = pair;
              const lineNumber = node.indexSource + 1; // 0 for (virtual) root, 1 for first line
              if (nextChildIndex === 0) {
                if(currentLineBatch.length >= BULK_BATCH_SIZE) {
                  currentLineBatch = [];
                  linesBatches.push(currentLineBatch);
                }
                currentLineBatch.push({
                  gedcomFileId,
                  lineNumber,
                  parentLineNumber,
                  tag: node.tag ?? '',
                  pointer: node.pointer ?? '',
                  value: node.value,
                });
                // Index
                if (queue.length === 3 && queue[1][0].tag === Tag.Family && queue[1][0].pointer !== null && node.value) {
                  if (node.tag === Tag.Husband || node.tag === Tag.Wife || node.tag === Tag.Child) {
                    if(currentIndexBatch.length >= BULK_BATCH_SIZE) {
                      currentIndexBatch = [];
                      indexBatches.push(currentIndexBatch);
                    }
                    currentIndexBatch.push({
                      gedcomFileId,
                      individualPointer: node.value,
                      relationType: node.tag === Tag.Child ? FamilyRelationType.Child : FamilyRelationType.Spouse,
                      familyPointer: queue[1][0].pointer,
                    });
                  }
                }
              }
              if (nextChildIndex < node.children.length) {
                queue.push([node.children[nextChildIndex], 0, lineNumber]);
                pair[1]++;
              } else {
                queue.pop();
              }
            }

            const totalBatchesSize = linesBatches.length + indexBatches.length;
            for (let i = 0; i < linesBatches.length; i++) {
              const linesBatch = linesBatches[i];
              await db.gedcomNodes.bulkAdd(linesBatch);
              if (progressCallback) {
                progressCallback(INDEXEDDB_PHASE, (i + 1) / totalBatchesSize);
              }
            }

            for (let i = 0; i < indexBatches.length; i++) {
              const indexBatch = indexBatches[i];
              await db.gedcomFamilyIndex.bulkAdd(indexBatch);
              if (progressCallback) {
                progressCallback(INDEXEDDB_PHASE, (linesBatches.length + i + 1) / totalBatchesSize)
              }
            }

            if (progressCallback && totalBatchesSize === 0) {
              progressCallback(INDEXEDDB_PHASE, 1);
            }

            return familyTreeId;
          });

          resolve(familyTreeId);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error());
      reader.readAsArrayBuffer(file);
    });
    return await promise;
  },
  parseGedcom(buffer: Buffer, progressCallback: (phase: GedcomReadingPhase, progress: null | number) => void) {
    return parseGedcom(buffer, { progressCallback });
  },
};

export type ComlinkApi = typeof api;

Comlink.expose(api);

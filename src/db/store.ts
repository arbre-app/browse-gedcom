import Dexie from 'dexie';

export class AppDatabase extends Dexie {
  // The second type argument is the type of the primary key
  familyTrees!: Dexie.Table<ModelFamilyTree, number>;
  gedcomFiles!: Dexie.Table<ModelGedcomFile, number>;
  gedcomNodes!: Dexie.Table<ModelGedcomNode, [number, number]>;
  gedcomFamilyIndex!: Dexie.Table<ModelGedcomFamilyIndex, [number, string, number]>;

  constructor() {
    super('mon.arbre.app');
    this.version(1).stores({
      familyTrees: '++id, &displayId, gedcomFileId',
      gedcomFiles: '++id',
      gedcomNodes: '[gedcomFileId+lineNumber], ' +
        '[gedcomFileId+parentLineNumber+lineNumber], ' +
        '[gedcomFileId+parentLineNumber+tag+lineNumber], ' +
        '[gedcomFileId+parentLineNumber+pointer]',
      gedcomFamilyIndex: '[gedcomFileId+individualPointer+relationType+familyPointer]',
    });
  }
}

export interface ModelFamilyTree {
  id?: number;

  displayId: string;
  gedcomFileId: number;

  createdAt: number;
  accessedAt: number;
  name: string;
  gedcomFileUpdates: number;
  rootIndividualPointer?: string;
}

export interface PartFileMeta {
  name: string;
  lastModified: number;
  size: number;
  type: string;
}

export interface ModelGedcomFile {
  id?: number; // (autoincremented)

  fileMeta: PartFileMeta;
  createdAt: number;
}

export interface ModelGedcomNode {
  gedcomFileId: number;
  lineNumber: number;

  parentLineNumber: number;
  tag: string;
  pointer: string;
  value: string | null;
}

export enum FamilyRelationType {
  Child = 1,
  Spouse = 2,
}

export interface ModelGedcomFamilyIndex {
  gedcomFileId: number;
  individualPointer: string;
  relationType: FamilyRelationType;
  familyPointer: string;
}

export interface ResolvedGedcomFile {
  gedcomFile: ModelGedcomFile;
}

export const db = new AppDatabase();

db.on('populate', tx => {
  // Initial data in DB; called only once (even if DB upgrades)
});

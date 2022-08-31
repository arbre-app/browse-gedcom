import { Collection } from 'dexie';
import { Tag } from 'read-gedcom';
import { GedcomFile } from './gedcom';
import { db, FamilyRelationType, ModelGedcomNode } from './store';

export const queryGedcom = (options: { tag?: string, limit?: number, offset?: number, pointer?: string } & ({ gedcomFileId?: number } | { node?: Pick<ModelGedcomNode, 'gedcomFileId' | 'lineNumber'> }) = {}): Collection<ModelGedcomNode> => {
  const node = (options as any).node as ModelGedcomNode | undefined;
  let gedcomFileId: number;
  if (node !== undefined) {
    const rawFamilyTreeId = (options as any).gedcomFileId as number | undefined;
    if (rawFamilyTreeId !== undefined && rawFamilyTreeId !== node.gedcomFileId) {
      throw new Error(); // Illegal argument
    }
    gedcomFileId = node.gedcomFileId;
  } else {
    gedcomFileId = (options as any).gedcomFileId as number; // Safe
  }
  const limit = options.limit ?? (1 << 30), offset = options.offset ?? 0;
  const parentLineNumber = node ? node.lineNumber : 0;
  const withPagination = (collection: Collection<ModelGedcomNode>): Collection<ModelGedcomNode> =>
    collection
      .offset(offset)
      .limit(limit);
  if (options.pointer !== undefined) {
    if (parentLineNumber !== 0) {
      throw new Error(); // Illegal argument
    }
    const { pointer } = options;
    return withPagination(db.gedcomNodes
      .where('[gedcomFileId+parentLineNumber+pointer]')
      .equals([gedcomFileId, parentLineNumber, pointer])
    ).filter(({ tag }) => options.tag === undefined || tag === options.tag);
  } else if (options.tag === undefined) {
    return withPagination(db.gedcomNodes
      .where('[gedcomFileId+parentLineNumber+lineNumber]')
      .between(
        [gedcomFileId, parentLineNumber, Number.MIN_SAFE_INTEGER],
        [gedcomFileId, parentLineNumber, Number.MAX_SAFE_INTEGER],
      ));
  } else {
    const { tag } = options;
    return withPagination(db.gedcomNodes
      .where('[gedcomFileId+parentLineNumber+tag+lineNumber]')
      .between(
        [gedcomFileId, parentLineNumber, tag, Number.MIN_SAFE_INTEGER],
        [gedcomFileId, parentLineNumber, tag, Number.MAX_SAFE_INTEGER],
      ));
  }
};


export class GedcomSelection {
  private constructor(
    protected readonly gedcomFileId: number,
    protected query: { parent: GedcomSelection, tag?: string, limit?: number, offset?: number } | null,
    protected promise: Promise<ModelGedcomNode[]> | null,
    protected result: ModelGedcomNode[] | null,
  ) {
    if (promise) {
      promise.then(result => {
        this.query = null;
        this.promise = null;
        this.result = result;
      });
    }
  }

  static fromArray(gedcomFileId: number, array: ModelGedcomNode[]): GedcomSelection {
    if (array.some(v => v.gedcomFileId !== gedcomFileId)) {
      throw new Error(); // Different trees
    }
    return new GedcomSelection(gedcomFileId, null, null, array);
  }

  static getRoot(gedcomFileId: number): GedcomSelection {
    const promise = queryGedcom({ node: { gedcomFileId, lineNumber: -1 } }).toArray();
    return new GedcomSelection(gedcomFileId, null, promise, null);
  }

  static getRecord(gedcomFileId: number, pointer: string, tag?: string): GedcomSelection {
    const promise = queryGedcom({ node: { gedcomFileId, lineNumber: 0 }, pointer, tag }).toArray();
    return new GedcomSelection(gedcomFileId, null, promise, null);
  }

  // TODO annoying that this has to be async
  static async getFamilyRecordByRelation(gedcomFileId: number, pointer: string, relation: FamilyRelationType): Promise<GedcomSelection> {
    const result = await db.gedcomFamilyIndex.where('[gedcomFileId+individualPointer+relationType+familyPointer]')
      .between([gedcomFileId, pointer, relation, ''], [gedcomFileId, pointer, relation, '~' /* FIXME ASCII hack! */]).toArray();
    const familyPointers = result.map(({ familyPointer }) => familyPointer);
    const nodes = await Promise.all(familyPointers.map(familyPointer => GedcomSelection.getRecord(gedcomFileId, familyPointer, Tag.Family).collect()));
    return GedcomSelection.fromArray(gedcomFileId, nodes.flat())
  }

  get(tag?: string, options: { limit?: number, offset?: number } = {}): GedcomSelection {
    return new GedcomSelection(this.gedcomFileId, { ...options, parent: this, tag }, null, null);
  }

  async collect(): Promise<ModelGedcomNode[]>;
  async collect<T>(f: (result: ModelGedcomNode[]) => T): Promise<T>;

  async collect<T>(f?: (result: ModelGedcomNode[]) => T): Promise<T> {
    const mapResult = (result: ModelGedcomNode[]) => f ? f(result) : result as any as T;
    if (this.result) { // Result already computed: return it
      return mapResult(this.result);
    } else if (this.promise) { // Result being computed: wait for that
      return mapResult(await this.promise);
    } else { // Not yet computed: compute it
      const promise = async () => {
        if (this.query) { // Query the children
          const { parent, tag, limit, offset } = this.query;
          const parentResult = await parent.collect();
          const arrays = await Promise.all(parentResult.map(node => queryGedcom({ node, tag, limit, offset }).toArray()));
          return arrays.flat();
        } else { // Base case
          return queryGedcom({ gedcomFileId: this.gedcomFileId }).toArray();
        }
      }
      this.promise = promise();
      this.result = await this.promise;
      this.promise = null;
      this.query = null; // GC
      return mapResult(this.result);
    }
  }

  async collectOne(): Promise<ModelGedcomNode | undefined>;
  async collectOne<T>(f: (result: ModelGedcomNode) => T): Promise<T | undefined>;

  async collectOne<T>(f?: (result: ModelGedcomNode) => T): Promise<T | undefined> {
    const result = await this.collect();
    return result.length > 0 ? (f ? f(result[0]) : result[0] as any as T) : undefined;
  }

  async count(): Promise<number> { // TODO optimize this method
    return this.collect().then(array => array.length);
  }
}

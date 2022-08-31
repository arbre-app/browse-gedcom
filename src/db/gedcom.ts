import { parseNameParts, Tag, ValueDate } from 'read-gedcom';
import { IfSelected, IfSelectedObject } from '../util';
import { GedcomSelection } from './api';
import { FamilyRelationType, ModelGedcomNode } from './store';

export class GedcomFile {
  private readonly root: GedcomSelection;
  constructor(private readonly gedcomFileId: number) {
    this.root = GedcomSelection.getRoot(gedcomFileId);
  }

  private getRecord(pointer: string, tag?: string) {
    return GedcomSelection.getRecord(this.gedcomFileId, pointer, tag);
  }

  private async getFamilyRecordByRelation(pointer: string, relation: FamilyRelationType) {
    return GedcomSelection.getFamilyRecordByRelation(this.gedcomFileId, pointer, relation);
  }

  async getGeneralStatistics(): Promise<GeneralStatistics> {
    // TODO parallel
    return {
      individuals: await this.root.get(Tag.Individual).count(),
      families: await this.root.get(Tag.Family).count(),
      sources: await this.root.get(Tag.Source).count(),
    };
  }

  async getIndividual(pointer: string): Promise<Individual | null>;
  async getIndividual<S extends Individual.Selection>(pointer: string, selection: S): Promise<Individual<S> | null>;
  async getIndividual<S extends Individual.Selection>(pointer: string, selection?: S): Promise<Individual<S> | null> {
    const individual = this.getRecord(pointer, Tag.Individual);
    if (await individual.count() === 0) {
      return null;
    }
    let partNames: Partial<Individual<{ names: true }>> = {};
    if (selection?.names) {
      const name = individual.get(Tag.Name);
      const [nameParts, surnameValue, givenNameValue] = await Promise.all([
        name.collectOne(v => parseNameParts(v.value)),
        name.get(Tag.Surname).collectOne(v => v.value),
        name.get(Tag.GivenName).collectOne(v => v.value),
      ]);
      partNames = {
        surname: surnameValue ?? (nameParts ? nameParts[1] : undefined),
        givenName: givenNameValue ?? (nameParts ? nameParts[0] : undefined),
        // TODO Suffix?
      };
    }
    let partParents: Partial<Individual<{ parents: {} }>> = {};
    if (selection?.parents) {
      const families = await this.getFamilyRecordByRelation(pointer, FamilyRelationType.Child);
      // TODO type of filiation, not just the first one!
      if (await families.count() > 0) {
        const [father, mother] = await Promise.all([families.get(Tag.Husband).collectOne(v => v.value), families.get(Tag.Wife).collectOne(v => v.value)]);
        const [fatherRecord, motherRecord] = await Promise.all([father ? this.getIndividual(father, selection.parents) : null, mother ? this.getIndividual(mother, selection.parents) : null]);
        partParents = {
          parents: {
            pointer: stripPointerArobase(await families.collectOne(v => v.pointer) as string),
            father: fatherRecord ?? undefined,
            mother: motherRecord ?? undefined,
          },
        };
      }
    }

    return {
      pointer: stripPointerArobase(pointer),
      ...partNames,
      ...partParents,
    };
  }

  async getIndividuals(offset: number, limit: number): Promise<View<Individual>>;
  async getIndividuals<S extends Individual.Selection>(offset: number, limit: number, selection: S): Promise<View<Individual<S>>>;
  async getIndividuals<S extends Individual.Selection>(offset: number, limit: number, selection?: S): Promise<View<Individual<S>>> {
    const pointers = await this.root.get(Tag.Individual).collect(r => r.map(v => v.pointer));
    const view = await Promise.all(pointers.slice(offset, offset + limit).map(pointer => this.getIndividual(pointer, selection ?? {}) as Promise<Individual<S>>));
    return {
      total: pointers.length,
      offset,
      count: view.length,
      result: view,
    };
  }
}

const stripPointerArobase = (pointer: string) => pointer.replaceAll('@', '');

export interface GeneralStatistics {
  individuals: number,
  families: number,
  sources: number,
}

export interface View<T> {
  total: number;
  offset: number;
  count: number;
  result: T[];
}

export interface Record {
  pointer: string;
}

export module Individual {
  export module Parts {
    export interface Names {
      surname?: string;
      givenName?: string;
    }
    export interface Parents<P extends Individual.Selection = {}> {
      parents?: {
        pointer: string;
        father?: Individual<P>;
        mother?: Individual<P>;
      }
    }
    export interface Spouses<S extends Individual.Selection = {}, C extends Individual.Selection = {}> {
      spouses?: {
        pointer: string;
        spouse?: Individual<S>;
        children: Individual<C>[];
      }
    }
    interface Event {
      date?: ValueDate;
      place?: string;
      description?: string;
    }
  }

  export interface Selection {
    names?: boolean;
    parents?: Selection;
  }
}

export type Individual<P extends Individual.Selection = {}> =
  Record &
  IfSelected<P, 'names', Individual.Parts.Names> &
  (P extends { parents: Individual.Selection } ? Individual.Parts.Parents : unknown);

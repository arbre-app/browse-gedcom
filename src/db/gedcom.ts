import { Tag } from 'read-gedcom';
import { GedcomSelection } from './api';

export class GedcomFile {
  private readonly root: GedcomSelection;
  constructor(private readonly familyTreeId: number) {
    this.root = GedcomSelection.getRoot(familyTreeId);
  }

  async getGeneralStatistics(): Promise<GeneralStatistics> {
    // TODO parallel
    return {
      individuals: await this.root.get(Tag.Individual).count(),
      families: await this.root.get(Tag.Family).count(),
      sources: await this.root.get(Tag.Source).count(),
    };
  }
}

export interface GeneralStatistics {
  individuals: number,
  families: number,
  sources: number,
}

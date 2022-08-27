import { useAsync } from 'react-use';
import { db, GedcomSelection, ModelGedcomFile } from '../db';

export const useFamilyTree = (displayId: string) => {
  return useAsync(async () => {
    const familyTrees = await db.familyTrees.where('displayId').equals(displayId).toArray();
    if (familyTrees.length === 1) {
      const familyTree = familyTrees[0];
      const gedcomFile = await db.gedcomFiles.get(familyTree.gedcomFileId) as ModelGedcomFile;
      return { ...familyTree, gedcomFile };
    } else {
      return null;
    }
  });
}

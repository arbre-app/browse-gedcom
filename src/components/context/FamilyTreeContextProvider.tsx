import { useContext } from 'react';
import * as React from 'react';
import { GedcomFile, ModelFamilyTree, ResolvedGedcomFile } from '../../db';

interface FamilyTreeContextData {
  familyTree: ModelFamilyTree & ResolvedGedcomFile;
  genealogy: GedcomFile;
}

const FamilyTreeContext = React.createContext<FamilyTreeContextData | undefined>(undefined);
export const FamilyTreeContextProvider = FamilyTreeContext.Provider;

export const useFamilyTreeContext = (): FamilyTreeContextData => {
  const value = useContext(FamilyTreeContext);
  if (value === undefined) {
    throw new Error(); // Outside of context
  }
  return value;
}

import { Close, Forest, Group, Home, ImportContacts, MenuBook, Person, Settings, Spa } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { MutableRefObject, useRef, useState } from 'react';
import * as React from 'react';
import { GedcomFile, GedcomSelection, ModelFamilyTree, ResolvedGedcomFile } from '../../db';
import { useFamilyTree } from '../../hooks';
import { BrandedResponsiveDrawer } from './BrandedResponsiveDrawer';
import { PageLayout } from './PageLayout';
import { FamilyTreeContextProvider } from '../context'

interface Props {
  pathname: string;
  displayId: string;
  children: React.ReactNode;
  title: string;
  icon?: typeof SvgIcon;
}

export function PageLayoutFamilyTree({ pathname, displayId, children, title, icon: Icon }: Props) {
  const { loading, value: familyTree, error } = useFamilyTree(displayId);

  return (
    <PageLayout>
      <BrandedResponsiveDrawer
        pathname={pathname}
        menu={!loading && familyTree ? [
          {
            title: familyTree.name,
            children: [
              { title: 'Aperçu', icon: Home, url: `/tree/${displayId}` },
              { title: 'Individus', icon: Person, url: `/tree/${displayId}/individuals` },
              { title: 'Familles', icon: Group, url: `/tree/${displayId}/families` },
              { title: 'Sources', icon: MenuBook, url: `/tree/${displayId}/sources` },
            ],
          },
          {
            children: [
              { title: 'Paramètres', icon: Settings, url: `/tree/${displayId}/settings` },
            ],
          },
          {
            children: [
              { title: `Fermer l'arbre`, icon: Close, url: `/` },
            ],
          },
        ] : []}
        title={title}
        icon={Icon}
      >
        {loading ? 'Chargement...' : familyTree ?
          (
            <FamilyTreeContextProvider value={{ familyTree, genealogy: new GedcomFile(familyTree.id as number) }}>
              {children}
            </FamilyTreeContextProvider>
          ) : 'Arbre introuvable : il a peut-être été supprimé'}
      </BrandedResponsiveDrawer>
    </PageLayout>
  );
}

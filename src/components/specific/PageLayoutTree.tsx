import { Close, Forest, Group, Home, ImportContacts, MenuBook, Person, Settings, Spa } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { MutableRefObject, useRef, useState } from 'react';
import * as React from 'react';
import { GedcomFile, GedcomSelection, ModelFamilyTree, ResolvedGedcomFile } from '../../db';
import { useFamilyTree } from '../../hooks';
import { BrandedResponsiveDrawer } from './BrandedResponsiveDrawer';

interface Props {
  pathname: string;
  displayId: string;
  children: (value: { familyTree: ModelFamilyTree & ResolvedGedcomFile, genealogy: GedcomFile }, meta: { setTitle: (s: string, icon?: typeof SvgIcon) => void }) => React.ReactNode;
}

export function PageLayoutTree({ pathname, displayId, children }: Props) {
  const { loading, value: familyTree, error } = useFamilyTree(displayId);
  const [title, setTitle] = useState<{ title: string, icon?: typeof SvgIcon }>({ title: '' });

  console.log(pathname)
  return (
    <BrandedResponsiveDrawer
      pathname={pathname}
      menu={!loading && familyTree ? [
        {
          title: familyTree.gedcomFile.fileMeta.name,
          children: [
            { title: 'Aperçu', icon: Home, url: `/tree/${displayId}` },
            { title: 'Individus', icon: Person, url: `/tree/${displayId}/individual` },
            { title: 'Familles', icon: Group, url: `/tree/${displayId}/family` },
            { title: 'Sources', icon: MenuBook, url: `/tree/${displayId}/source` },
          ],
        },
        {
          children: [
            { title: 'Paramètres', icon: Settings, url: `/settings` },
          ],
        },
        {
          children: [
            { title: `Fermer l'arbre`, icon: Close, url: `/` },
          ],
        },
      ] : []}
      title={loading ? '' : familyTree ? title.title : 'Arbre introuvable'}
      icon={loading ? undefined : title.icon}
    >
      {loading ? 'Chargement...' : familyTree ? children({ familyTree, genealogy: new GedcomFile(familyTree.id as number) }, { setTitle: (title, icon) => setTitle({ title, icon }) }) : 'Arbre introuvable : il a peut-être été supprimé'}
    </BrandedResponsiveDrawer>
  );
}

import { Spa, Info, Publish, Home } from '@mui/icons-material';
import * as React from 'react';
import { useAsync } from 'react-use';
import { db, ModelGedcomFile } from '../../db';
import { BrandedResponsiveDrawer } from './BrandedResponsiveDrawer';
import { PageLayout } from './PageLayout';

interface Props {
  pathname: string;
  title: string;
  children?: React.ReactNode;
}

export function PageLayoutHome({ pathname, title, children }: Props) {
  const { loading, value: familyTrees, error } = useAsync(async () => {
    const familyTrees = await db.familyTrees.toArray();
    return await Promise.all(familyTrees.map(familyTree => db.gedcomFiles.get(familyTree.id as number).then(gedcomFile => ({ ...familyTree, gedcomFile: gedcomFile as ModelGedcomFile }))));
  });

  return (
    <PageLayout>
      <BrandedResponsiveDrawer
        pathname={pathname}
        menu={[
          {
            children: [
              {
                title: 'Accueil',
                icon: Home,
                url: '/',
              },
              {
                title: 'Charger Gedcom',
                icon: Publish,
                url: '/load',
              }
            ]
          },
          ...(familyTrees && familyTrees.length > 0 ? [{
            title: 'Arbres généalogiques',
            children: familyTrees ? familyTrees.map(familyTree => ({
              title: familyTree.name,
              icon: Spa,
              url: `/tree/${familyTree.displayId}`,
            })) : [],
          }] : []),
          {
            children: [
              { title: 'À propos', icon: Info, url: '/about' },
            ],
          },
        ]}
        title={title}
      >
        {children}
      </BrandedResponsiveDrawer>
    </PageLayout>
  );
}

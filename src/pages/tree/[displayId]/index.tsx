import { Home, MenuBook, People, Person } from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SvgIcon, Typography,
} from '@mui/material';
import { ListItemButton } from 'gatsby-material-ui-components';
import { useEffect } from 'react';
import * as React from 'react';
import { useAsync } from 'react-use';
import { useFamilyTreeContext } from '../../../components/context';
import { PageLayoutFamilyTree } from '../../../components/specific';
import { theme } from '../../../components/theme';
import { GedcomFile, GeneralStatistics, ModelFamilyTree, ResolvedGedcomFile } from '../../../db';

interface LayoutProps {
}

function TreeIndexLayout({}: LayoutProps) {
  const { familyTree, genealogy } = useFamilyTreeContext();

  const { value } = useAsync(() => genealogy.getGeneralStatistics());

  useEffect(() => {
    //setTitle(familyTree.gedcomFile.fileMeta.name, Home);
  }, []);

  const statisticsFields: { key: string & keyof GeneralStatistics, title: string, icon: typeof SvgIcon, url: string }[] = [
    {
      key: 'individuals',
      title: 'Individus',
      icon: Person,
      url: `/tree/${familyTree.displayId}/individuals`,
    },
    {
      key: 'families',
      title: 'Familles',
      icon: People,
      url: `/tree/${familyTree.displayId}/families`,
    },
    {
      key: 'sources',
      title: 'Sources',
      icon: MenuBook,
      url: `/tree/${familyTree.displayId}/sources`,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <List
          sx={{ bgcolor: theme.palette.background.paper }}
          subheader={
            <ListSubheader>
              Statistiques
            </ListSubheader>
          }
        >
          {value && statisticsFields.map(({ key, title, icon: Icon, url }) => (
            <ListItemButton
              key={key}
              to={url}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={
                <>
                  {title}
                </>
              } />
              <Chip label={value[key]} />
            </ListItemButton>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

interface PageProps {
  displayId: string;
  location: {
    pathname: string;
  };
}

function TreeIndexPage({ displayId, location: { pathname } }: PageProps) {
  return (
    <PageLayoutFamilyTree pathname={pathname} displayId={displayId} title="Aperçu">
      <TreeIndexLayout />
    </PageLayoutFamilyTree>
  );
}

export default TreeIndexPage;

export function Head() {
  return <title>Tree</title>;
}

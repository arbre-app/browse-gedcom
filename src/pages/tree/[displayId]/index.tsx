import { Home, MenuBook, People, Person } from '@mui/icons-material';
import {
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SvgIcon,
} from '@mui/material';
import { ListItemButton } from 'gatsby-material-ui-components';
import { useEffect } from 'react';
import * as React from 'react';
import { useAsync } from 'react-use';
import { PageLayoutTree } from '../../../components/specific';
import { theme } from '../../../components/theme';
import { GedcomFile, GeneralStatistics, ModelFamilyTree, ResolvedGedcomFile } from '../../../db';

interface LayoutProps {
  familyTree: ModelFamilyTree & ResolvedGedcomFile;
  genealogy: GedcomFile;
  setTitle: (s: string, icon?: typeof SvgIcon) => void;
}

function TreeIndexLayout({ familyTree, genealogy, setTitle }: LayoutProps) {
  const { value } = useAsync(() => genealogy.getGeneralStatistics());

  useEffect(() => {
    setTitle(familyTree.gedcomFile.fileMeta.name, Home);
  }, []);

  const statisticsFields: { key: string & keyof GeneralStatistics, title: string, icon: typeof SvgIcon }[] = [
    {
      key: 'individuals',
      title: 'Individus',
      icon: Person,
    },
    {
      key: 'families',
      title: 'Familles',
      icon: People,
    },
    {
      key: 'sources',
      title: 'Sources',
      icon: MenuBook,
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
          {value && statisticsFields.map(({ key, title, icon: Icon }) => (
            <ListItemButton
              key={key}
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
    <PageLayoutTree pathname={pathname} displayId={displayId}>
      {({ familyTree, genealogy }, { setTitle }) => <TreeIndexLayout familyTree={familyTree} genealogy={genealogy} setTitle={setTitle} />}
    </PageLayoutTree>
  );
}

export default TreeIndexPage;

export function Head() {
  return <title>Tree</title>;
}

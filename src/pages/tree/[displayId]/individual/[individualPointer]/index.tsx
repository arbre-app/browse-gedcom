import { People } from '@mui/icons-material';
import {
  Avatar,
  Box, CardHeader,
  Paper,
  SvgIcon, Typography,
} from '@mui/material';
import { useDataGridComponent } from '@mui/x-data-grid/DataGrid/useDataGridComponent';
import { gridPageSizeSelector } from '@mui/x-data-grid/hooks/features/pagination/gridPaginationSelector';
import { Link } from 'gatsby-material-ui-components';
import { useEffect } from 'react';
import * as React from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { navigate } from 'gatsby';
import { useFamilyTreeContext } from '../../../../../components/context';
import { IndividualLink, PageLayoutFamilyTree } from '../../../../../components/specific';
import { GedcomFile, ModelFamilyTree, ResolvedGedcomFile } from '../../../../../db';
import { displayIndividualName } from '../../../../../util';

interface LayoutProps {
  individualPointer: string;
}

function IndividualLayout({ individualPointer }: LayoutProps) {
  const { familyTree, genealogy } = useFamilyTreeContext();

  const { loading, value: individual } = useAsync(() => genealogy.getIndividual(`@${individualPointer}@`, { names: true, parents: { names: true } }), [genealogy, individualPointer]);

  if (!individual) {
    return null;
  }

  const fullname = displayIndividualName(individual);

  return (
    <>
      <CardHeader
        avatar={
          <Avatar alt={fullname}>{[individual.givenName?.[0], individual.surname?.[0]].filter(s => s).join('')}</Avatar>
        }
        title={fullname}
      />
      {individual.parents && (
        <>
          <Typography variant="h6">Parents</Typography>
          <ul>
            <li>
              <IndividualLink individual={individual.parents?.father} />
            </li>
            <li>
              <IndividualLink individual={individual.parents?.mother} />
            </li>
          </ul>
        </>
      )}
      {JSON.stringify(individual)}
    </>
  );
}

interface PageProps {
  displayId: string;
  individualPointer: string,
  location: {
    pathname: string;
  };
}

function IndividualPage({ displayId, individualPointer, location: { pathname } }: PageProps) {
  return (
    <PageLayoutFamilyTree pathname={pathname} displayId={displayId} title="Individu">
      <IndividualLayout individualPointer={individualPointer} />
    </PageLayoutFamilyTree>
  );
}

export default IndividualPage;

export function Head() {
  return <title>Individus</title>;
}

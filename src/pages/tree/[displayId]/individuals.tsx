import { People, Visibility } from '@mui/icons-material';
import { Button } from 'gatsby-material-ui-components';
import * as React from 'react';
import { useFamilyTreeContext } from '../../../components/context';
import { AsyncDataGrid } from '../../../components/general';
import { PageLayoutFamilyTree } from '../../../components/specific';
import {
  GridColDef,
} from '@mui/x-data-grid';

interface LayoutProps {
}

function IndividualsLayout({}: LayoutProps) {
  const { familyTree, genealogy } = useFamilyTreeContext();

  const columns: GridColDef[] = [
    { field: 'action', headerName: '', width: 100, align: 'center', renderCell: o => <Button to={`/tree/${familyTree.displayId}/individual/${o.id}`}><Visibility /></Button>, disableColumnMenu: true },
    { field: 'pointer', headerName: 'Identifiant', width: 150, disableColumnMenu: true },
    { field: 'surname', headerName: 'Nom', width: 300, disableColumnMenu: true },
    { field: 'givenName', headerName: 'Prénom', width: 300, disableColumnMenu: true },
  ];

  return (
    <AsyncDataGrid columns={columns} fetchRows={state => genealogy.getIndividuals(state.page * state.pageSize, state.pageSize, { names: true })} getRowId={row => row.pointer} />
  );
}

interface PageProps {
  displayId: string;
  location: {
    pathname: string;
  };
}

function IndividualsPage({ displayId, location: { pathname } }: PageProps) {
  return (
    <PageLayoutFamilyTree pathname={pathname} displayId={displayId} title="Individus" icon={People}>
      <IndividualsLayout />
    </PageLayoutFamilyTree>
  );
}

export default IndividualsPage;

export function Head() {
  return <title>Individus</title>;
}

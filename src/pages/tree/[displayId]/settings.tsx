import { Delete, Save, Settings } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import * as React from 'react';
import { useAsyncFn } from 'react-use';
import { useFamilyTreeContext } from '../../../components/context';
import { PageLayoutFamilyTree } from '../../../components/specific';
import { DeleteFamilyTreeButton } from '../../../components/specific/DeleteFamilyTreeButton';
import { db, ModelFamilyTree } from '../../../db';

function SettingsLayout() {
  const { familyTree, genealogy } = useFamilyTreeContext();

  const [familyTreeName, setFamilyTreeName] = useState(familyTree.name);

  const [{ loading, error }, saveSettings] = useAsyncFn((original: ModelFamilyTree, changes: object) => db.familyTrees.update(original, changes), []);

  const handleSave = () => {
    return saveSettings(familyTree, { name: familyTreeName });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <DeleteFamilyTreeButton familyTree={familyTree} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <TextField label="Nom de l'arbre" variant="outlined" value={familyTreeName} onChange={e => setFamilyTreeName(e.target.value)} disabled={loading} />
            <LoadingButton variant="contained" startIcon={<Save />} onClick={handleSave} loading={loading}>Enregistrer</LoadingButton>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

interface PageProps {
  displayId: string;
  location: {
    pathname: string;
  };
}

function SettingsPage({ displayId, location: { pathname } }: PageProps) {
  return (
    <PageLayoutFamilyTree pathname={pathname} displayId={displayId} title="Paramètres de l'arbre" icon={Settings}>
      <SettingsLayout />
    </PageLayoutFamilyTree>
  );
}

export default SettingsPage;

export function Head() {
  return <title>Paramètres</title>;
}

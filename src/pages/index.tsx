import { LoadingButton } from '@mui/lab';
import { Alert, Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';
import * as Comlink from 'comlink';
import * as React from 'react';
import { ChangeEventHandler, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { PageLayoutTree } from '../components/specific';
import { PageLayoutHome } from '../components/specific/PageLayoutHome';
import { db, ModelFamilyTree } from '../db';
import { workerApi } from '../workerApi';
import { navigate } from 'gatsby';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface Props {
  location: {
    pathname: string;
  };
}

function IndexPage({ location: { pathname } }: Props) {
  const [{ loading, value, error }, createFamilyTree] = useAsyncFn(
    async (file: File, progressCallback: (phase: number, progress: number | null) => void) => await workerApi.createFamilyTree(file, progressCallback),
  );

  const [progress, setProgress] = useState<[number, number] | null>(null);

  const progressToValue = ([phase, progress]: [number, number]) => {
    const weights = [1, 2 / 3, 1 / 3, 50];
    const runningWeights = [0];
    for (let i = 0; i < weights.length; i++) {
      runningWeights.push(runningWeights[i] + weights[i]);
    }
    const totalWeight = runningWeights[weights.length];
    return (runningWeights[phase] + weights[phase] * progress) / totalWeight;
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = e => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      createFamilyTree(file, Comlink.proxy((phase, progress) => setProgress([phase, progress as number])))
        .then(async familyTreeId => {
          setProgress(null);
          const { displayId } = await db.familyTrees.get(familyTreeId) as ModelFamilyTree;
          return navigate(`/tree/${displayId}`);
        })
        .finally(() => {
          e.target.value = ''; // Clear file
        });
    }
  };

  const phasesNames = [
    `Lecture du fichier...`,
    `Traitement du fichier...`,
    `Organisation de l'arbre...`,
    `Enregistrement des données...`,
  ];

  return (
    <PageLayoutHome pathname={pathname} title="Charger un fichier Gedcom">
      {error && (
        <Alert severity="error"><strong>{error.name}</strong>: {error.message}</Alert>
      )}
      <LoadingButton variant="contained" component="label" disabled={loading} loading={loading}>
        Charger un fichier Gedcom
        <input hidden type="file" accept=".ged,.gedcom,application/x-gedcom" name="gedcomFile"
               onChange={handleFileChange} />
      </LoadingButton>
      {progress !== null && (
        <>
          {phasesNames[progress[0]]}
          <CircularProgressWithLabel value={progressToValue(progress) * 100} />
        </>
      )}
    </PageLayoutHome>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}

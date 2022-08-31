import { Publish } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, CircularProgress, CircularProgressProps, Grid, Typography } from '@mui/material';
import * as Comlink from 'comlink';
import * as React from 'react';
import { ChangeEventHandler, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { PageLayoutFamilyTree } from '../components/specific';
import { PageLayoutHome } from '../components/specific';
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

  const inputRef = useRef<HTMLInputElement>(null);

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
      <Grid container>
        <Grid item xs={0} md={3} />
        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error"><strong>{error.name}</strong>: {error.message}</Alert>
          )}
          <Box component="span" sx={{ p: 2, py: 5, border: '2px dashed lightgrey', display: 'flex', flexDirection: 'column', textAlign: 'center', color: 'rgba(0, 0, 0, 0.8)', cursor: loading ? 'default' : 'pointer' }} onClick={() => !loading && (inputRef.current as HTMLInputElement).click()}>
            <Box>
              {progress !== null ? (
                <CircularProgressWithLabel value={progressToValue(progress) * 100} />
              ) : (
                <Publish fontSize="large" />
              )}
            </Box>
            <Box>
              {progress !== null ? (
                phasesNames[progress[0]]
              ) : (
                <>
                  Charger un fichier Gedcom...
                </>
              )}
            </Box>
            <input ref={inputRef} hidden type="file" accept=".ged,.gedcom,application/x-gedcom" name="gedcomFile" onChange={handleFileChange} />
          </Box>
        </Grid>
      </Grid>
    </PageLayoutHome>
  );
}

export default IndexPage;

export function Head() {
  return <title>Home Page</title>;
}

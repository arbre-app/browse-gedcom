import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { navigate } from 'gatsby';
import * as React from 'react';
import { useAsyncFn } from 'react-use';
import { db, ModelFamilyTree, ResolvedGedcomFile } from '../../db';
import { workerApi } from '../../workerApi';

interface Props {
  familyTree: ModelFamilyTree & ResolvedGedcomFile;
}

export function DeleteFamilyTreeButton({ familyTree }: Props) {
  const [open, setOpen] = React.useState(false);
  const [{ loading, value }, deleteFamilyTree] = useAsyncFn(() => workerApi.deleteFamilyTree(familyTree.id as number), [familyTree]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    return deleteFamilyTree().then(() => {
      setOpen(false);
      navigate('/');
    });
  };

  return (
    <>
      <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleClickOpen}>
        Supprimer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Suppression de l'arbre généalogique
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Vous êtes sur le point de supprimer cet arbre de votre navigateur: {familyTree.name}.
            {' '}
            Ceci ne modifiera pas le fichier Gedcom que vous avez utilisé pour l'importer.
            {' '}
            L'opération peut prendre quelques instants.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(!loading && value === undefined) && (
            <Button onClick={handleClose} autoFocus>Annuler</Button>
          )}
          <LoadingButton onClick={handleConfirm} loading={loading || value !== undefined}>Supprimer</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

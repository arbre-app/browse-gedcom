import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const theme = createTheme({
  /*components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&$selected': {
            backgroundColor: 'red',
            '&:hover': {
              backgroundColor: 'yellow',
            }
          },
        },
      },
    },
  },*/
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // Disable DataGrid outline
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          /*'&.MuiDataGrid-root .MuiDataGrid-cell': {
            cursor: 'pointer',
          },*/
        },
      },
    },
  },
});

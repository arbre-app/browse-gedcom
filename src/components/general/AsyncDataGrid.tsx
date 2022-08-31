import { Box, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { isNumber } from '@mui/x-data-grid/internals';
import { GridRowIdGetter, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useAsync } from 'react-use';
import * as qs from 'query-string';
import { navigate } from '@reach/router';

interface AsyncDataGridState {
  page: number;
  pageSize: number;
}

interface Props<R extends GridValidRowModel = any> {
  columns: GridColDef<R>[];
  fetchRows: (state: AsyncDataGridState) => Promise<{ result: GridRowsProp<R>, total: number }>;
  getRowId: GridRowIdGetter<R>;
  defaultState?: Partial<AsyncDataGridState>;
}

export function AsyncDataGrid({ columns, fetchRows, getRowId, defaultState }: Props) {
  const actualDefaultState: AsyncDataGridState = { page: 0, pageSize: 10, ...(defaultState ?? {}) };

  const initialState: AsyncDataGridState = (() => {
    const parsed = qs.parseUrl(window.location.href).query;
    const page = isNumber(parsed.page) ? Math.max(Math.round(parsed.page as number), 0) : actualDefaultState.page;
    const pageSize = isNumber(parsed.pageSize) ? Math.max(Math.round(parsed.pageSize as number), 1) : actualDefaultState.pageSize;
    return { page, pageSize };
  })();

  const [currentState, setCurrentState] = useState(initialState);

  const { value, loading } = useAsync(() => {
    console.log(currentState)
    return fetchRows(currentState);
  }, [currentState]);

  const reduceState = (muiState: any): AsyncDataGridState => {
    const { page, pageSize } = muiState.pagination;
    return { page, pageSize };
  };

  const handleStateChange = (muiState: any) => {
    const newState = reduceState(muiState);
    const queryString = qs.stringify(newState);
    if (queryString !== qs.stringify(currentState)) {
      setCurrentState(newState);
      return navigate(`?${queryString}`, { replace: true });
    }
  };

  return (
    <Paper elevation={0}>
      <Box sx={{ height: 600 }}>
        {value && (
          <DataGrid
            rows={value.result}
            rowCount={value.total}
            rowsPerPageOptions={[actualDefaultState.pageSize]}
            columns={columns.map(props => ({ ...props, disableColumnMenu: true }))}
            loading={loading}
            initialState={{ pagination: { page: currentState.page, pageSize: currentState.pageSize } }}
            getRowId={getRowId}
            disableSelectionOnClick
            onStateChange={handleStateChange}
          />
        )}
      </Box>
    </Paper>
  );
}

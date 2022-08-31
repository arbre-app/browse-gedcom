import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { theme } from '../theme';

interface Props {
  children: React.ReactNode;
}

export function PageLayout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

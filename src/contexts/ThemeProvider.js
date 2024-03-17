import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

export function Theme({ children }) {
  const tema = createTheme({
    palette: {
      primary: {
        light: '#fff',
        main: '#222',
        dark: '#000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#fff',
        main: '#f44336',
        dark: '#000',
        contrastText: '#000',
      },
    },
  });

  return <ThemeProvider theme={tema}>{children && children}</ThemeProvider>;
}

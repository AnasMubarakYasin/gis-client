import { useState, useMemo } from 'react';
import ContextColor from '@/context/color';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import config from '@/config/theme';

export default function Theme(props) {
  const [mode, setMode] = useState('dark');
  const colorMode = useMemo(
    () => ({
      toggleMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = useMemo(
    () => createTheme(deepmerge(config[mode], { palette: { mode, }, })),
    [mode],
  );

  return (
    <ContextColor.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline></CssBaseline>
        {props.children}
      </ThemeProvider>
    </ContextColor.Provider>
  )
}

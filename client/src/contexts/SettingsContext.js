import PropTypes from 'prop-types';
import React, { createContext } from 'react';
// hooks
import useLocalStorage from '../hooks/useLocalStorage';
// theme
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const PRIMARY_COLOR = [
  // DEFAULT
  {
    name: 'default',
    ...palette.light.primary
  },
  // PINK
  {
    name: 'pink',
    lighter: '#ffdeeb',
    light: '#ff99b9',
    main: '#ff5c8a',
    dark: '#ba1141',
    darker: '#8a0030',
    contrastText: '#fff'
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#fff'
  }
];

function SetColor(themeColor) {
  let color;
  const DEFAULT = PRIMARY_COLOR[0];
  const PINK = PRIMARY_COLOR[1];
  const PURPLE = PRIMARY_COLOR[2];

  switch (themeColor) {
    case 'pink':
      color = PINK;
      break;
    case 'purple':
      color = PURPLE;
      break;
    default:
      color = DEFAULT;
  }
  return color;
}

const initialState = {
  themeMode: 'light',
  themeColor: 'default',
  onChangeMode: () => {},
  onChangeColor: () => {},
  setColor: PRIMARY_COLOR[0],
  colorOption: []
};

const SettingsContext = createContext(initialState);

SettingsProvider.propTypes = {
  children: PropTypes.node
};

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: 'light',
    themeColor: 'default'
  });

  const onChangeMode = (event) => {
    setSettings({
      ...settings,
      themeMode: event.target.value
    });
  };

  const onChangeColor = (event) => {
    setSettings({
      ...settings,
      themeColor: event.target.value
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onChangeMode,
        onChangeColor,
        setColor: SetColor(settings.themeColor),
        colorOption: PRIMARY_COLOR.map((color) => ({
          name: color.name,
          value: color.main
        }))
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [backgroundClass, setBackgroundClass] = useState('background-witch-cottage');

  const changeBackgroundClass = (newClass) => {
    setBackgroundClass(newClass);
  };

  return (
    <ThemeContext.Provider value={{ backgroundClass, changeBackgroundClass }}>
      {children}
    </ThemeContext.Provider>
  );
};
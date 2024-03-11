import { createContext, useState, useContext, useEffect } from 'react';

const SelectedTaskContext = createContext();

export const useSelectedTask = () => useContext(SelectedTaskContext);

export const SelectedTaskProvider = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  return (
    <SelectedTaskContext.Provider value={{ selectedTaskId, setSelectedTaskId }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};

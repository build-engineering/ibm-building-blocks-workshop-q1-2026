import { createContext, useContext, useState } from 'react';
import { getDatasetIds } from '../data/datasetsConfig';

const DatasetContext = createContext();

export function DatasetProvider({ children }) {
  const [selectedDataset, setSelectedDataset] = useState(getDatasetIds()[0]);

  return (
    <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}

// Made with Bob

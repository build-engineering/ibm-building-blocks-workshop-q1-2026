import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from '@carbon/react';
import { useDataset } from '../context/DatasetContext';
import { getAllDatasets, getDatasetById } from '../data/datasetsConfig';
import UrbanBuildLogo from './logos/UrbanBuildLogo';
import RetainIQLogo from './logos/RetainIQLogo';
import FlowMetricsLogo from './logos/FlowMetricsLogo';
import './header.scss';

function Header() {
  const location = useLocation();
  const { selectedDataset, setSelectedDataset } = useDataset();
  
  const datasets = getAllDatasets();
  const currentDataset = getDatasetById(selectedDataset);
  
  const datasetItems = datasets.map(dataset => ({
    id: dataset.id,
    label: dataset.name
  }));

  const handleDatasetChange = ({ selectedItem }) => {
    if (selectedItem) {
      setSelectedDataset(selectedItem.id);
    }
  };

  // Select the appropriate logo based on dataset
  const LogoComponent = () => {
    switch (selectedDataset) {
      case 'san-francisco-building-permits':
        return <UrbanBuildLogo size={32} />;
      case 'multi-channel-customer-behavior':
        return <RetainIQLogo size={32} />;
      case 'ecommerce-order-and-supply-chain':
        return <FlowMetricsLogo size={32} />;
      default:
        return <UrbanBuildLogo size={32} />;
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <LogoComponent />
          <span className="logo-text">{currentDataset?.companyName || 'Analytics'}</span>
        </div>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            about
          </Link>
          <Link 
            to="/dashboards" 
            className={`nav-link ${location.pathname === '/dashboards' ? 'active' : ''}`}
          >
            dashboards
          </Link>
        </nav>
        <div className="header-dataset-selector">
          <Dropdown
            id="dataset-selector"
            titleText=""
            label="Select Dataset"
            items={datasetItems}
            itemToString={(item) => (item ? item.label : '')}
            selectedItem={datasetItems.find(item => item.id === selectedDataset)}
            onChange={handleDatasetChange}
            size="md"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;

// Made with Bob

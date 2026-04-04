import { Grid, Column } from '@carbon/react';
import { useDataset } from '../context/DatasetContext';
import { getDatasetById } from '../data/datasetsConfig';
import Chart from '../components/Chart';
import './dashboards.scss';

function Dashboards() {
  const { selectedDataset } = useDataset();
  const dataset = getDatasetById(selectedDataset);

  if (!dataset) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboards-page">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="dashboards-header">
            <h1 className="dashboards-heading">Data Insights</h1>
            <p className="dashboards-description">
              Explore key metrics and trends from the {dataset.name} dataset
            </p>
          </div>
        </Column>
      </Grid>

      <Grid narrow className="dashboards-grid">
        {dataset.charts.map((chart) => (
          <Column key={chart.id} sm={4} md={4} lg={5} xlg={5} className="dashboard-column">
            <Chart chart={chart} />
          </Column>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboards;

// Made with Bob

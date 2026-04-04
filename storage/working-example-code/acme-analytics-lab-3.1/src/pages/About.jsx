import { Grid, Column, Tile, Tag } from '@carbon/react';
import { DataBase, ChartLine, Analytics, Dashboard } from '@carbon/icons-react';
import { useDataset } from '../context/DatasetContext';
import { getDatasetById } from '../data/datasetsConfig';
import './about.scss';

function About() {
  const { selectedDataset } = useDataset();
  const dataset = getDatasetById(selectedDataset);

  if (!dataset) {
    return <div>Loading...</div>;
  }

  // Icon mapping for use cases
  const icons = [DataBase, ChartLine, Analytics, Dashboard, DataBase, ChartLine];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Grid>
          <Column sm={4} md={8} lg={10} xlg={10}>
            <div className="hero-content">
              <Tag type="blue" className="hero-tag">Enterprise Data Analytics</Tag>
              <h1 className="hero-heading">{dataset.name}</h1>
              <p className="hero-description">{dataset.description}</p>
            </div>
          </Column>
          <Column sm={4} md={8} lg={6} xlg={6}>
            <div className="hero-stats">
              <Tile className="stat-tile">
                <div className="stat-icon">
                  <DataBase size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">Real-time</div>
                  <div className="stat-label">Data Processing</div>
                </div>
              </Tile>
              <Tile className="stat-tile">
                <div className="stat-icon">
                  <Analytics size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">Advanced</div>
                  <div className="stat-label">Analytics Engine</div>
                </div>
              </Tile>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Use Cases Section */}
      <div className="use-cases-section">
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <div className="section-header">
              <h2 className="section-heading">Business Use Cases</h2>
              <p className="section-description">
                Unlock powerful insights and drive data-driven decisions across your organization
              </p>
            </div>
          </Column>
        </Grid>

        <Grid className="use-cases-grid">
          {dataset.useCases.map((useCase, index) => {
            const IconComponent = icons[index];
            return (
              <Column key={index} sm={4} md={4} lg={5} xlg={5} className="use-case-column">
                <Tile className="use-case-card">
                  <div className="use-case-header">
                    <div className="use-case-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="use-case-number">0{index + 1}</div>
                  </div>
                  <h3 className="use-case-title">{useCase.title}</h3>
                  <p className="use-case-description">{useCase.description}</p>
                </Tile>
              </Column>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

export default About;

// Made with Bob

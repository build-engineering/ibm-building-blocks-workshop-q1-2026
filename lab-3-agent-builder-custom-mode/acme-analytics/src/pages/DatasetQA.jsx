import { useState } from 'react';
import { Grid, Column, Select, SelectItem, Button, Loading, InlineNotification } from '@carbon/react';
import { useDataset } from '../context/DatasetContext';
import { getDatasetById } from '../data/datasetsConfig';
import './datasetqa.scss';

// Generate interesting questions for each dataset
const datasetQuestions = {
  'san-francisco-building-permits': [
    'What are the top 5 neighborhoods with the most building permits?',
    'How has the average permit processing time changed over the years?',
    'What percentage of permits are for new construction vs alterations?',
    'Which permit types have the longest approval times?',
    'What is the correlation between permit cost and processing time?',
    'How many permits were issued in the Financial District compared to other neighborhoods?'
  ],
  'multi-channel-customer-behavior': [
    'What factors contribute most to customer churn?',
    'How does login frequency impact customer retention rates?',
    'Which age group has the highest churn rate and why?',
    'What is the relationship between cart abandonment and customer churn?',
    'How does membership duration affect customer lifetime value?',
    'Which countries have the best customer retention rates?'
  ],
  'ecommerce-order-and-supply-chain': [
    'What are the most popular product categories by sales volume?',
    'How does payment method preference vary across customer segments?',
    'What is the average delivery time and how can it be improved?',
    'Which months show the highest order volumes and why?',
    'What percentage of orders are canceled and what are the main reasons?',
    'How does order value distribution impact revenue optimization?'
  ]
};

const API_BASE_URL = 'http://localhost:3001';

function DatasetQA() {
  const { selectedDataset } = useDataset();
  const dataset = getDatasetById(selectedDataset);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [htmlResponse, setHtmlResponse] = useState(null);

  if (!dataset) {
    return <div>Loading...</div>;
  }

  const questions = datasetQuestions[selectedDataset] || [];

  const handleSubmit = async () => {
    if (!selectedQuestion) return;

    setLoading(true);
    setError(null);
    setHtmlResponse(null);

    try {
      console.log('Sending question to backend:', { question: selectedQuestion, dataset: selectedDataset });

      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: selectedQuestion,
          dataset: selectedDataset,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from agent');
      }

      if (data.success && data.html) {
        setHtmlResponse(data.html);
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error('Error calling agent:', err);
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="datasetqa-page">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="datasetqa-header">
            <h1 className="datasetqa-heading">Ask questions of your data</h1>
            <p className="datasetqa-subheading">
              Select a question about the {dataset.name} dataset and get AI-powered insights with visualizations
            </p>
          </div>
        </Column>
      </Grid>

      <Grid className="datasetqa-content">
        <Column sm={4} md={8} lg={16}>
          <div className="datasetqa-form">
            <Select
              id="question-select"
              labelText="Select a question"
              placeholder="Select a question"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              disabled={loading}
            >
              <SelectItem value="" text="Select a question" />
              {questions.map((question, index) => (
                <SelectItem 
                  key={index} 
                  value={question} 
                  text={question} 
                />
              ))}
            </Select>
            
            <Button 
              className="datasetqa-submit"
              onClick={handleSubmit}
              disabled={!selectedQuestion || loading}
            >
              {loading ? 'Analyzing...' : 'Submit'}
            </Button>
          </div>

          {loading && (
            <div className="datasetqa-loading">
              <Loading description="Analyzing data and generating insights..." withOverlay={false} />
              <p className="loading-message">
                The AI agent is analyzing your data. This may take 30-60 seconds...
              </p>
            </div>
          )}

          {error && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              onCloseButtonClick={() => setError(null)}
              className="datasetqa-error"
            />
          )}

          {htmlResponse && !loading && (
            <div className="datasetqa-results">
              <h2 className="results-title">Results</h2>
              <div className="results-container">
                <iframe
                  srcDoc={htmlResponse}
                  title="Agent Response"
                  className="results-iframe"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </Column>
      </Grid>
    </div>
  );
}

export default DatasetQA;

// Made with Bob
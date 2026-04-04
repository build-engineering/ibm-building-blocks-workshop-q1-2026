import { useState } from 'react';
import { Grid, Column, Dropdown, Button, Loading, Accordion, AccordionItem } from '@carbon/react';
import { useDataset } from '../context/DatasetContext';
import { getDatasetById } from '../data/datasetsConfig';
import './datachat.scss';

// Generate interesting questions for each dataset
const datasetQuestions = {
  'san-francisco-building-permits': [
    'What are the top 5 neighborhoods with the most building permits?',
    'How has the average permit processing time changed over the years?',
    'What percentage of permits are for new construction vs alterations?',
    'Which permit types have the highest estimated costs?',
    'What is the correlation between permit cost and processing time?',
    'How many permits were cancelled or withdrawn and why?'
  ],
  'multi-channel-customer-behavior': [
    'Which age group has the highest churn rate and why?',
    'How does login frequency impact customer retention?',
    'What is the relationship between cart abandonment and churn?',
    'Which countries have the best customer retention rates?',
    'How does membership duration affect customer lifetime value?',
    'What behavioral patterns distinguish active customers from churned ones?'
  ],
  'ecommerce-order-and-supply-chain': [
    'What are the top-selling product categories by revenue?',
    'How does payment method preference vary across different order values?',
    'What is the average delivery time and how can it be improved?',
    'Which months show the highest order volumes and why?',
    'What percentage of orders are cancelled and what are the main reasons?',
    'How does order value distribution impact inventory planning?'
  ]
};

function DataChat() {
  const { selectedDataset } = useDataset();
  const dataset = getDatasetById(selectedDataset);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  if (!dataset) {
    return <div>Loading...</div>;
  }

  const questions = datasetQuestions[selectedDataset] || [];
  
  const questionItems = questions.map((question, index) => ({
    id: `question-${index}`,
    label: question
  }));

  const handleQuestionChange = ({ selectedItem }) => {
    if (selectedItem) {
      setSelectedQuestion(selectedItem.label);
      // Clear previous response when selecting new question
      setResponse(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuestion) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('Sending question to backend:', { question: selectedQuestion, dataset: selectedDataset });

      const res = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: selectedQuestion,
          dataset: selectedDataset
        })
      });

      // Check if response is ok before parsing JSON
      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Agent returned unsuccessful response');
      }

      setResponse(data);
      console.log('Response received:', data);
    } catch (err) {
      console.error('Error submitting question:', err);
      setError(err.message || 'An error occurred while processing your question');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="datachat-page">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="datachat-header">
            <h1 className="datachat-heading">Ask questions of your data</h1>
          </div>
        </Column>
      </Grid>

      <Grid className="datachat-controls">
        <Column sm={4} md={6} lg={12}>
          <Dropdown
            id="question-selector"
            titleText=""
            label="Select a question"
            items={questionItems}
            itemToString={(item) => (item ? item.label : '')}
            selectedItem={questionItems.find(item => item.label === selectedQuestion) || null}
            onChange={handleQuestionChange}
            size="lg"
            disabled={isLoading}
          />
        </Column>
        <Column sm={4} md={2} lg={4}>
          <Button
            kind="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedQuestion || isLoading}
            className="submit-button"
          >
            {isLoading ? 'Processing...' : 'submit'}
          </Button>
        </Column>
      </Grid>

      <Grid className="datachat-content">
        <Column sm={4} md={8} lg={16}>
          <div className="datachat-response-area">
            {isLoading && (
              <div className="loading-container">
                <Loading description="Agent is thinking..." withOverlay={false} />
                <p className="loading-text">
                  The agent is analyzing your question and generating insights. This may take 30-60 seconds...
                </p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            )}

            {response && !isLoading && (
              <div className="response-container">
                {/* Step History Section */}
                {response.stepHistory && response.stepHistory.length > 0 && (
                  <div className="step-history-section">
                    <Accordion>
                      <AccordionItem title={`Agent Reasoning (${response.stepHistory.length} steps)`}>
                        <div className="step-history-content">
                          {response.stepHistory.map((step, index) => (
                            <div key={index} className="step-item">
                              <div className="step-header">
                                <strong>Step {index + 1}</strong>
                                {step.timestamp && (
                                  <span className="step-timestamp">
                                    {new Date(step.timestamp).toLocaleTimeString()}
                                  </span>
                                )}
                              </div>
                              <div className="step-details">
                                <pre>{JSON.stringify(step, null, 2)}</pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Full JSON Response Section */}
                <div className="json-response-section">
                  <Accordion>
                    <AccordionItem title="Full JSON Response">
                      <div className="json-content">
                        <pre>{JSON.stringify(response.fullResponse, null, 2)}</pre>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* HTML Result Section - Always Visible */}
                <div className="html-result-section">
                  <h3>Result</h3>
                  <div className="iframe-container">
                    <iframe
                      srcDoc={response.html}
                      sandbox="allow-scripts allow-same-origin"
                      className="results-iframe"
                      title="Agent Response"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Column>
      </Grid>
    </div>
  );
}

export default DataChat;

// Made with Bob
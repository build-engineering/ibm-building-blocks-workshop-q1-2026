import { useState } from 'react';
import { Grid, Column, Select, SelectItem, Button } from '@carbon/react';
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

function DatasetQA() {
  const { selectedDataset } = useDataset();
  const dataset = getDatasetById(selectedDataset);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  if (!dataset) {
    return <div>Loading...</div>;
  }

  const questions = datasetQuestions[selectedDataset] || [];

  const handleSubmit = () => {
    // For now, do nothing when submit is clicked
    console.log('Submit clicked with question:', selectedQuestion);
  };

  return (
    <div className="datasetqa-page">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="datasetqa-header">
            <h1 className="datasetqa-heading">Ask questions of your data</h1>
          </div>
        </Column>
      </Grid>

      <Grid className="datasetqa-content">
        <Column sm={4} md={8} lg={10} xlg={8}>
          <div className="datasetqa-form">
            <Select
              id="question-select"
              labelText=""
              placeholder="Select a question"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
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
              disabled={!selectedQuestion}
            >
              submit
            </Button>
          </div>
        </Column>
      </Grid>
    </div>
  );
}

export default DatasetQA;

// Made with Bob
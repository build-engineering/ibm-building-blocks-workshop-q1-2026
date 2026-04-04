# Acme Analytics - Dataset Analytics Website

A dynamic data analytics website built with React, Carbon Design System, and Chart.js that visualizes insights from multiple datasets.

## Features

- **Multi-Dataset Support**: Switch between three different datasets using the dropdown selector
- **Interactive Dashboards**: 6 charts per dataset displaying key insights and trends
- **Responsive Design**: Built with Carbon Design System for consistent, accessible UI
- **Dynamic Content**: About page with dataset descriptions and business use cases
- **Data Visualizations**: Bar charts, line charts, pie charts, and doughnut charts using Chart.js

## Available Datasets

### 1. San Francisco Building Permits
- 198,900 building permits from 2013-2018
- Insights on permit types, costs, neighborhoods, and processing times
- Use cases: Urban planning, real estate investment, construction industry insights

### 2. Multi-Channel Customer Behavior
- 50,000 customer records with behavioral and demographic data
- Analysis of churn rates, engagement patterns, and customer lifetime value
- Use cases: Churn prediction, customer segmentation, marketing optimization

### 3. eCommerce Order & Supply Chain
- 89,316 e-commerce transactions
- Order status, product categories, payment methods, and delivery metrics
- Use cases: Supply chain optimization, inventory management, revenue analytics

## Technology Stack

- **Frontend Framework**: React 18
- **UI Components**: Carbon Design System (@carbon/react)
- **Routing**: React Router v6
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Sass with Carbon Design tokens
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
acme-analytics/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with dataset selector
│   │   ├── Chart.jsx           # Reusable chart component
│   │   └── *.scss              # Component styles
│   ├── pages/
│   │   ├── About.jsx           # Dataset info and use cases
│   │   ├── Dashboards.jsx      # Chart visualizations
│   │   └── *.scss              # Page styles
│   ├── context/
│   │   └── DatasetContext.jsx  # Dataset state management
│   ├── data/
│   │   └── datasetsConfig.js   # Dataset metadata and chart data
│   ├── App.jsx                 # Main application component
│   └── main.jsx                # Application entry point
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd lab-2-dataset-powered-website/acme-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Switching Datasets

Use the dropdown selector in the upper-right corner of the header to switch between datasets. The About page and Dashboards page will automatically update to show the selected dataset's information and visualizations.

### Navigation

- **About**: View dataset description and business use cases
- **Dashboards**: Explore 6 interactive charts with insights

## Data Analysis

All chart data was generated through exploratory data analysis using pandas on the original datasets. The analysis included:

- Distribution analysis (permit types, order status, churn rates)
- Trend analysis (time series, monthly patterns)
- Categorical analysis (top categories, neighborhoods, countries)
- Correlation analysis (cart abandonment vs churn, login frequency vs retention)
- Cost/value analysis (permit costs, order values, lifetime value)

## Design System

This project follows the IBM Carbon Design System principles:

- **Typography**: Carbon type styles for consistent hierarchy
- **Spacing**: Carbon spacing tokens for uniform layout
- **Colors**: Carbon color tokens for accessible contrast
- **Components**: Carbon React components for UI consistency
- **Grid**: Carbon Grid system for responsive layouts

## Chart Types

- **Bar Charts**: Comparing categories (permit types, top neighborhoods, churn by country)
- **Line Charts**: Showing trends over time (permits by year, monthly orders)
- **Pie/Doughnut Charts**: Displaying proportions (cost distribution, payment methods, order status)

## Accessibility

- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure
- ARIA labels where appropriate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project was created for educational purposes.

---

Built with IBM Bob - Data Website Builder Mode
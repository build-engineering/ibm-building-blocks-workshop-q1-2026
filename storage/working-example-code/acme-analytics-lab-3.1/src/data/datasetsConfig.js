// Dataset configuration with all chart data and metadata
export const datasetsConfig = {
  'san-francisco-building-permits': {
    id: 'san-francisco-building-permits',
    name: 'San Francisco Building Permits',
    companyName: 'UrbanBuild Analytics',
    description: 'Comprehensive dataset of building permits issued by San Francisco from 2013 to 2018, containing information about permit types, costs, locations, and processing times.',
    
    useCases: [
      {
        title: 'Urban Planning & Development',
        description: 'City planners can analyze construction trends to identify growing neighborhoods, predict infrastructure needs, and allocate resources effectively for future development.'
      },
      {
        title: 'Real Estate Investment Analysis',
        description: 'Real estate investors can identify emerging neighborhoods with high construction activity, assess property development potential, and make data-driven investment decisions.'
      },
      {
        title: 'Construction Industry Insights',
        description: 'Construction companies can analyze permit processing times, identify peak construction periods, and optimize their project planning and resource allocation.'
      },
      {
        title: 'Regulatory Compliance Monitoring',
        description: 'Government agencies can track permit approval efficiency, identify bottlenecks in the approval process, and improve regulatory workflows.'
      },
      {
        title: 'Economic Development Tracking',
        description: 'Economic development agencies can monitor construction investment trends, assess neighborhood revitalization efforts, and measure the impact of development policies.'
      }
    ],

    charts: [
      {
        id: 'permit-types',
        title: 'Top Permit Types',
        description: 'Distribution of the most common building permit types in San Francisco',
        type: 'bar',
        data: {
          labels: ['OTC Alterations', 'Additions/Repairs', 'Sign - Erect', 'New Construction Wood', 'Demolitions', 'Wall/Painted Sign', 'New Construction', 'Grade/Quarry/Fill'],
          datasets: [{
            label: 'Number of Permits',
            data: [178844, 14663, 2892, 950, 600, 511, 349, 91],
            backgroundColor: '#0f62fe'
          }]
        }
      },
      {
        id: 'cost-distribution',
        title: 'Permit Cost Distribution',
        description: 'Breakdown of building permits by estimated cost ranges',
        type: 'pie',
        data: {
          labels: ['<$5K', '$5K-$25K', '$25K-$100K', '$100K-$500K', '>$500K'],
          datasets: [{
            data: [53537, 57815, 32766, 12010, 4706],
            backgroundColor: ['#0f62fe', '#8a3ffc', '#1192e8', '#009d9a', '#ee5396']
          }]
        }
      },
      {
        id: 'top-neighborhoods',
        title: 'Top 10 Neighborhoods by Permits',
        description: 'Neighborhoods with the highest number of building permits issued',
        type: 'bar',
        data: {
          labels: ['Financial District', 'Mission', 'Sunset/Parkside', 'West Twin Peaks', 'Castro/Upper Market', 'Pacific Heights', 'Marina', 'Outer Richmond', 'Noe Valley', 'South of Market'],
          datasets: [{
            label: 'Number of Permits',
            data: [21816, 14681, 10207, 8739, 8527, 8508, 8244, 7854, 7844, 7572],
            backgroundColor: '#8a3ffc'
          }]
        }
      },
      {
        id: 'permits-by-year',
        title: 'Permit Trends Over Time',
        description: 'Annual trend of building permits from 2013 to 2018',
        type: 'line',
        data: {
          labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
          datasets: [{
            label: 'Permits Issued',
            data: [35227, 36691, 40138, 39740, 41151, 5953],
            borderColor: '#1192e8',
            backgroundColor: 'rgba(17, 146, 232, 0.1)',
            tension: 0.4
          }]
        }
      },
      {
        id: 'processing-time',
        title: 'Average Processing Time by Permit Type',
        description: 'Average days from filing to issuance for different permit types',
        type: 'bar',
        data: {
          labels: ['New Construction', 'Wood Frame', 'Demolitions', 'Additions/Repairs', 'Grade/Quarry', 'Sign - Erect', 'Wall/Painted', 'OTC Alterations'],
          datasets: [{
            label: 'Days',
            data: [479, 398, 348, 247, 97, 53, 45, 11],
            backgroundColor: '#009d9a'
          }]
        }
      },
      {
        id: 'permit-status',
        title: 'Permit Status Distribution',
        description: 'Current status of all building permits in the system',
        type: 'doughnut',
        data: {
          labels: ['Complete', 'Issued', 'Filed', 'Withdrawn', 'Cancelled', 'Expired', 'Approved', 'Reinstated'],
          datasets: [{
            data: [97077, 83559, 12043, 1754, 1536, 1370, 733, 563],
            backgroundColor: ['#0f62fe', '#8a3ffc', '#1192e8', '#009d9a', '#ee5396', '#ff832b', '#f1c21b', '#da1e28']
          }]
        }
      }
    ]
  },

  'multi-channel-customer-behavior': {
    id: 'multi-channel-customer-behavior',
    name: 'Multi-Channel Customer Behavior',
    companyName: 'RetainIQ',
    description: 'Comprehensive customer engagement and churn analytics dataset containing behavioral, demographic, and transactional data for 50,000 customers across a global e-commerce platform.',
    
    useCases: [
      {
        title: 'Customer Churn Prediction',
        description: 'Build machine learning models to predict which customers are likely to churn, enabling proactive retention strategies and targeted interventions.'
      },
      {
        title: 'Customer Segmentation',
        description: 'Segment customers based on behavior patterns, demographics, and engagement levels to create personalized marketing campaigns and improve customer experience.'
      },
      {
        title: 'Marketing Campaign Optimization',
        description: 'Analyze customer engagement metrics to optimize email campaigns, social media strategies, and promotional offers for maximum ROI.'
      },
      {
        title: 'Lifetime Value Forecasting',
        description: 'Predict customer lifetime value to prioritize high-value customers, allocate marketing budgets effectively, and improve customer acquisition strategies.'
      },
      {
        title: 'User Experience Improvement',
        description: 'Identify friction points in the customer journey by analyzing cart abandonment rates, session duration, and mobile app usage to enhance the overall user experience.'
      }
    ],

    charts: [
      {
        id: 'churn-by-country',
        title: 'Churn Rate by Country',
        description: 'Customer churn rates across different geographic markets',
        type: 'bar',
        data: {
          labels: ['Australia', 'Canada', 'USA', 'India', 'Germany', 'UK', 'Japan', 'France'],
          datasets: [{
            label: 'Churn Rate (%)',
            data: [29.9, 29.4, 29.1, 29.0, 28.8, 28.8, 27.8, 27.3],
            backgroundColor: '#0f62fe'
          }]
        }
      },
      {
        id: 'churn-by-age',
        title: 'Churn Rate by Age Group',
        description: 'How customer age affects churn probability',
        type: 'line',
        data: {
          labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
          datasets: [{
            label: 'Churn Rate (%)',
            data: [45.5, 26.5, 25.4, 26.1, 26.5],
            borderColor: '#8a3ffc',
            backgroundColor: 'rgba(138, 63, 252, 0.1)',
            tension: 0.4
          }]
        }
      },
      {
        id: 'churn-by-login',
        title: 'Login Frequency Impact on Churn',
        description: 'Relationship between login frequency and customer retention',
        type: 'bar',
        data: {
          labels: ['0-5', '6-10', '11-15', '16-20', '20+'],
          datasets: [{
            label: 'Churn Rate (%)',
            data: [40.7, 28.7, 23.0, 21.4, 18.1],
            backgroundColor: '#1192e8'
          }]
        }
      },
      {
        id: 'churn-by-abandonment',
        title: 'Cart Abandonment vs Churn',
        description: 'How cart abandonment rate correlates with customer churn',
        type: 'bar',
        data: {
          labels: ['0-25%', '26-50%', '51-75%', '76-100%'],
          datasets: [{
            label: 'Churn Rate (%)',
            data: [14.5, 19.5, 26.3, 64.6],
            backgroundColor: '#009d9a'
          }]
        }
      },
      {
        id: 'lifetime-value',
        title: 'Average Lifetime Value by Churn Status',
        description: 'Comparison of customer lifetime value between active and churned customers',
        type: 'bar',
        data: {
          labels: ['Active Customers', 'Churned Customers'],
          datasets: [{
            label: 'Lifetime Value ($)',
            data: [1446.81, 1425.42],
            backgroundColor: ['#0f62fe', '#da1e28']
          }]
        }
      },
      {
        id: 'churn-by-membership',
        title: 'Churn Rate by Membership Duration',
        description: 'How membership length affects customer retention',
        type: 'line',
        data: {
          labels: ['<1 year', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
          datasets: [{
            label: 'Churn Rate (%)',
            data: [28.6, 28.8, 29.2, 29.1, 28.7],
            borderColor: '#ee5396',
            backgroundColor: 'rgba(238, 83, 150, 0.1)',
            tension: 0.4
          }]
        }
      }
    ]
  },

  'ecommerce-order-and-supply-chain': {
    id: 'ecommerce-order-and-supply-chain',
    name: 'eCommerce Order & Supply Chain',
    companyName: 'FlowMetrics',
    description: 'Comprehensive e-commerce dataset containing order information, customer data, product details, payment methods, and supply chain metrics for 89,316 transactions.',
    
    useCases: [
      {
        title: 'Supply Chain Optimization',
        description: 'Analyze delivery times, order fulfillment rates, and logistics performance to optimize supply chain operations and reduce delivery delays.'
      },
      {
        title: 'Inventory Management',
        description: 'Track product category performance and sales trends to optimize inventory levels, reduce stockouts, and minimize holding costs.'
      },
      {
        title: 'Revenue Analytics',
        description: 'Analyze order values, payment methods, and sales trends to identify revenue opportunities and optimize pricing strategies.'
      },
      {
        title: 'Customer Behavior Analysis',
        description: 'Study purchasing patterns, order frequencies, and product preferences to improve product recommendations and marketing strategies.'
      },
      {
        title: 'Operational Efficiency',
        description: 'Monitor order processing times, cancellation rates, and fulfillment metrics to identify operational bottlenecks and improve efficiency.'
      }
    ],

    charts: [
      {
        id: 'order-status',
        title: 'Order Status Distribution',
        description: 'Current status of all orders in the system',
        type: 'pie',
        data: {
          labels: ['Delivered', 'Shipped', 'Canceled', 'Processing', 'Invoiced', 'Unavailable', 'Approved'],
          datasets: [{
            data: [87428, 936, 409, 273, 266, 2, 2],
            backgroundColor: ['#0f62fe', '#8a3ffc', '#da1e28', '#ff832b', '#1192e8', '#009d9a', '#f1c21b']
          }]
        }
      },
      {
        id: 'top-categories',
        title: 'Top 10 Product Categories',
        description: 'Best-selling product categories by total sales volume',
        type: 'bar',
        data: {
          labels: ['Toys', 'Health & Beauty', 'Computers', 'Garden Tools', 'Watches & Gifts', 'Bed/Bath/Table', 'Furniture', 'Sports', 'Cool Stuff', 'Perfumery'],
          datasets: [{
            label: 'Sales Volume',
            data: [1869621, 161543, 102499, 96819, 81796, 30278, 24276, 23881, 22530, 17813],
            backgroundColor: '#8a3ffc'
          }]
        }
      },
      {
        id: 'monthly-orders',
        title: 'Monthly Order Trends',
        description: 'Order volume trends over the past 12 months',
        type: 'line',
        data: {
          labels: ['Oct 2017', 'Nov 2017', 'Dec 2017', 'Jan 2018', 'Feb 2018', 'Mar 2018', 'Apr 2018', 'May 2018', 'Jun 2018', 'Jul 2018', 'Aug 2018', 'Sep 2018'],
          datasets: [{
            label: 'Orders',
            data: [4258, 6840, 4981, 6463, 6069, 6508, 6200, 6163, 5510, 5430, 5555, 1],
            borderColor: '#1192e8',
            backgroundColor: 'rgba(17, 146, 232, 0.1)',
            tension: 0.4
          }]
        }
      },
      {
        id: 'payment-types',
        title: 'Payment Method Distribution',
        description: 'Preferred payment methods used by customers',
        type: 'doughnut',
        data: {
          labels: ['Credit Card', 'Wallet', 'Voucher', 'Debit Card'],
          datasets: [{
            data: [65814, 17302, 4911, 1289],
            backgroundColor: ['#0f62fe', '#8a3ffc', '#1192e8', '#009d9a']
          }]
        }
      },
      {
        id: 'order-value',
        title: 'Order Value Distribution',
        description: 'Distribution of orders across different price ranges',
        type: 'bar',
        data: {
          labels: ['<$50', '$50-$100', '$100-$200', '$200-$500', '>$500'],
          datasets: [{
            label: 'Number of Orders',
            data: [12674, 13992, 24278, 27206, 11165],
            backgroundColor: '#009d9a'
          }]
        }
      },
      {
        id: 'delivery-performance',
        title: 'Average Delivery Time',
        description: 'Average number of days from order to delivery',
        type: 'bar',
        data: {
          labels: ['Delivered Orders'],
          datasets: [{
            label: 'Days',
            data: [12.0],
            backgroundColor: '#0f62fe'
          }]
        }
      }
    ]
  }
};

export const getDatasetById = (id) => datasetsConfig[id];
export const getAllDatasets = () => Object.values(datasetsConfig);
export const getDatasetIds = () => Object.keys(datasetsConfig);

// Made with Bob

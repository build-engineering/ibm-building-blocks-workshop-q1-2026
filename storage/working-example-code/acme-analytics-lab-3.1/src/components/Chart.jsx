import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import './chart.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Chart({ chart }) {
  const chartRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: chart.type === 'bar' || chart.type === 'line' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : undefined
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return <Bar ref={chartRef} data={chart.data} options={options} />;
      case 'line':
        return <Line ref={chartRef} data={chart.data} options={options} />;
      case 'pie':
        return <Pie ref={chartRef} data={chart.data} options={options} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={chart.data} options={options} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{chart.title}</h3>
        <p className="chart-description">{chart.description}</p>
      </div>
      <div className="chart-canvas">
        {renderChart()}
      </div>
    </div>
  );
}

export default Chart;

// Made with Bob
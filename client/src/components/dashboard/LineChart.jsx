import React, { useEffect, useState } from 'react';
import { useFetchPPMP } from '../../hooks/ppmp/FetchPPMP.js'; // Import the updated hook
import { useFetchPR } from '../../hooks/pr/FetchPr.js'; // Import the updated hook
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Import necessary components

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const { ppmpData } = useFetchPPMP();
  const { prData } = useFetchPR(); // Newly added data
  const [monthlyPPMPData, setMonthlyPPMPData] = useState([]);
  const [monthlyPRData, setMonthlyPRData] = useState([]);

  useEffect(() => {
    // Process PPMP data
    if (ppmpData) {
      const ppmpMonthCount = new Array(12).fill(0);
      ppmpData.forEach((item) => {
        const paperDate = new Date(item.createdAt);
        const month = paperDate.getMonth(); // Get the month (0-11)
        ppmpMonthCount[month] += 1; // Increment the count for that month
      });
      setMonthlyPPMPData(ppmpMonthCount);
    }

    // Process PR data
    if (prData) {
      const prMonthCount = new Array(12).fill(0);
      prData.forEach((item) => {
        const paperDate = new Date(item.createdAt);
        const month = paperDate.getMonth(); // Get the month (0-11)
        prMonthCount[month] += 1; // Increment the count for that month
      });
      setMonthlyPRData(prMonthCount);
    }
  }, [ppmpData, prData]);

  // Data for the chart
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'PPMP Uploads',
        data: monthlyPPMPData,
        fill: false,
        borderColor: '#30a838', // Green line for PPMP
        tension: 0.1,
      },
      {
        label: 'PR Uploads',
        data: monthlyPRData,
        fill: false,
        borderColor: '#4287f5', // Blue line for PR
        tension: 0.1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Current Entries for PPMP and PR for the whole year',
        font: {
          size: 18,
        },
      },
      legend: {
        position: 'top',
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 15,
        right: 15,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(188, 192, 198,1)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(188, 192, 198,1)',
        },
      },
    },
  };

  return (
    <div className="chart-container flex flex-grow h-[275px]">
      <Line data={data} options={options} height={275} width={null} />
    </div>
  );
};

export default LineChart;

'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PerformanceMetrics() {
  const [data, setData] = useState({
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#45a049', '#e6ae06', '#da190b'],
      },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setData({
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
          {
            data: [65, 25, 10],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            hoverBackgroundColor: ['#45a049', '#e6ae06', '#da190b'],
          },
        ],
      });
    };
    fetchData();
  }, []);

  return (
    <div className="widget">
      <h2 className="widget-title text-teal-600">Performance Metrics</h2>
      <Doughnut data={data} className="bg-black" />
    </div>
  );
}

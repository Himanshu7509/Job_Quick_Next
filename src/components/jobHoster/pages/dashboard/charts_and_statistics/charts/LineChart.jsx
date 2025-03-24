'use client'
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Cookies from "js-cookie";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState("");
  const [graphData, setGraphData] = useState({
    labels: [],
    dataPoints: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartRendered, setChartRendered] = useState(false);
  
  // Get token from cookies on the client side only
  const [token, setToken] = useState("");
  
  useEffect(() => {
    // Set token from cookies only on the client side
    setToken(Cookies.get("authToken") || "");
    
    // Signal that the component is mounted and ready for client-side operations
    setChartRendered(true);
  }, []);

  // Function to get ordered days ending with today
  const getOrderedDays = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();
    const orderedDays = [];
    for (let i = 1; i <= 7; i++) {
      const index = (today + i) % 7;
      orderedDays.push(days[index]);
    }
    orderedDays.pop();
    orderedDays.push(days[today]);
    return orderedDays;
  };

  // Check if jobs prop exists and has items before setting selectedJob
  useEffect(() => {
    if (jobs && Array.isArray(jobs) && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]._id);
    }
  }, [jobs, selectedJob]);
  
  // Only fetch graph data when we have a valid selectedJob and token
  useEffect(() => {
    if (selectedJob && token && chartRendered) {
      fetchGraphData(selectedJob);
    }
  }, [selectedJob, token, chartRendered]);
  
  const fetchGraphData = async (jobId) => {
    if (!jobId || !token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://next-jobquick.onrender.com/api/v1/applicant/graph/${jobId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const orderedDays = getOrderedDays();
        const dataPoints = orderedDays.map(day => {
          const dayData = data.data.find(d => d.day === day);
          return dayData ? dayData.applicants : 0;
        });

        setGraphData({ labels: orderedDays, dataPoints });
      } else {
        throw new Error("API returned success: false or missing data");
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
      setError(error.message || "Failed to load chart data");
    } finally {
      setIsLoading(false);
    }
  };

  const getYAxisMax = () => {
    if (!graphData.dataPoints || graphData.dataPoints.length === 0) return 8;
    const maxApplicants = Math.max(...graphData.dataPoints);
    return maxApplicants <= 8 ? 8 : Math.ceil(maxApplicants / 4) * 4;
  };

  const getStepSize = () => {
    const max = getYAxisMax();
    return max <= 8 ? 1 : Math.ceil(max / 8);
  };

  const chartData = {
    labels: graphData.labels,
    datasets: [
      {
        label: selectedJob ? "Applicants" : "Select a job to view applications",
        data: graphData.dataPoints,
        borderColor: "#0d9488", // Teal
        backgroundColor: "rgba(13, 148, 136, 0.1)", // Teal with opacity
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#0d9488", // Teal
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 11,
            weight: "500",
          },
          color: "#0f766e", // Darker teal for legend
        },
      },
      tooltip: {
        backgroundColor: "rgba(13, 148, 136, 0.9)", // Teal tooltip
        padding: 8,
        titleFont: {
          size: 12,
          weight: "600",
        },
        bodyFont: {
          size: 11,
        },
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} Applicants`;
          }
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: getYAxisMax(),
        ticks: {
          stepSize: getStepSize(),
          precision: 0,
          font: {
            size: 10,
          },
          color: "#0f766e", // Darker teal for ticks
        },
        grid: {
          color: "rgba(13, 148, 136, 0.06)", // Very light teal for grid
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#0f766e", // Darker teal for ticks
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="lg:h-[450px] w-full rounded-xl p-2">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-teal-800">
            Applicants Per Day
          </h2>
          
          <div className="w-full sm:w-56">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg 
                         text-sm text-gray-700 focus:border-teal-500 focus:ring-2 
                         focus:ring-teal-200 outline-none transition-colors duration-200"
              disabled={!jobs || jobs.length === 0 || isLoading}
            >
              <option value="">Select a job</option>
              {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))
              ) : (
                <option value="">No jobs available</option>
              )}
            </select>
          </div>
        </div>

        <div className="w-full h-[250px] rounded-lg relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-teal-600">Loading chart data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center p-4">
                <p>Error loading data: {error}</p>
              </div>
            </div>
          ) : chartRendered && graphData.labels.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-teal-600 text-center p-4">
                <p>{jobs && jobs.length > 0 ? "Select a job to view data" : "No job data available"}</p>
              </div>
            </div>
          )}
        </div>

        {selectedJob && graphData.dataPoints && graphData.dataPoints.length > 0 && (
          <div className="lg:mt-[45px] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <p className="text-xs text-teal-600">Total Applicants</p>
              <p className="text-lg font-semibold text-teal-700">
                {graphData.dataPoints.reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="p-2 bg-teal-50 rounded-lg">
              <p className="text-xs text-teal-600">Peak Day</p>
              <p className="text-lg font-semibold text-teal-700">
                {graphData.dataPoints.some(p => p > 0) 
                  ? graphData.labels[graphData.dataPoints.indexOf(Math.max(...graphData.dataPoints))]
                  : "N/A"}
              </p>
            </div>
            <div className="p-2 bg-teal-50 rounded-lg">
              <p className="text-xs text-teal-600">Average/Day</p>
              <p className="text-lg font-semibold text-teal-700">
                {graphData.dataPoints.length > 0 
                  ? (graphData.dataPoints.reduce((a, b) => a + b, 0) / 7).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="p-2 bg-teal-50 rounded-lg">
              <p className="text-xs text-teal-600">Active Days</p>
              <p className="text-lg font-semibold text-teal-700">
                {graphData.dataPoints.filter(x => x > 0).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;
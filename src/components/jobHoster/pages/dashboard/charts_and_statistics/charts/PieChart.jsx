import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PieChartIcon, CirclePlus } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

// Don't register at the top level for better SSR compatibility

const PieChart = ({ jobs }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    // Set browser flag and register chart.js only on client side
    setIsBrowser(true);
    if (typeof window !== 'undefined') {
      ChartJS.register(ArcElement, Tooltip, Legend);
      if (jobs && jobs.length > 0) {
        fetchAllCompaniesData();
      } else {
        setIsLoading(false);
      }
    }
  }, [jobs]);

  const fetchAllCompaniesData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const companyTotals = {};
      const token = Cookies.get("authToken");
      
      if (!token) {
        console.warn("Authentication token not found");
        setError("Authentication failed. Please log in again.");
        setIsLoading(false);
        return;
      }

      await Promise.all(
        jobs.map(async (job) => {
          try {
            const url = `https://next-jobquick.onrender.com/api/v1/applicant/graph/${job._id}`;
            const response = await fetch(url, {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              method: 'GET'
            });
            
            if (!response.ok) {
              console.warn(`API error for job ${job._id}: ${response.status}`);
              return; // Skip this job but continue with others
            }
            
            const result = await response.json();
            const applicants = result.data
              ? result.data.reduce((sum, day) => sum + day.applicants, 0)
              : 0;

            companyTotals[job.companyName] =
              (companyTotals[job.companyName] || 0) + applicants;
          } catch (jobError) {
            console.error(`Error fetching data for job ${job._id}:`, jobError);
            // Continue with other jobs
          }
        })
      );

      const data = Object.entries(companyTotals).map(([company, total]) => ({
        name: company,
        applicants: total,
      }));

      setChartData(data);
    } catch (error) {
      console.error("Error fetching companies data:", error);
      setError("Failed to load chart data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      colors.push(`hsla(${hue}, 70%, 50%, 0.8)`);
    }
    return colors;
  };

  const colors = generateColors(chartData.length);

  const pieChartData = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        data: chartData.map((item) => item.applicants),
        backgroundColor: colors,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 10,
        titleFont: { size: 12, weight: "600" },
        bodyFont: { size: 11 },
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} Applicants (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalApplicants = chartData.reduce(
    (sum, item) => sum + item.applicants,
    0
  );

  // Empty state component
  const EmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
      <PieChartIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mb-2" />
      <p className="text-sm font-medium text-gray-500">No Applications Yet</p>
      <p className="text-xs text-gray-400 text-center mt-1 max-w-xs">
        Data will appear here once candidates apply for your jobs
      </p>
      <div className="mt-4">
        <Link href="/post-job">
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 text-xs md:text-sm rounded-lg shadow-md border border-teal-700 transition duration-300 flex items-center gap-1">
            <CirclePlus className="w-3 h-3" />
            <span>Post Your First Job</span>
          </button>
        </Link>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = ({ message }) => (
    <div className="h-full flex flex-col items-center justify-center bg-red-50 rounded-lg p-4">
      <PieChartIcon className="w-10 h-10 md:w-12 md:h-12 text-red-300 mb-2" />
      <p className="text-sm font-medium text-red-500">Unable to Load Chart</p>
      <p className="text-xs text-red-400 text-center mt-1 max-w-xs">
        {message || "There was a problem loading the chart data"}
      </p>
      <button 
        onClick={() => fetchAllCompaniesData()}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 text-xs rounded-lg shadow-md transition duration-300"
      >
        Retry
      </button>
    </div>
  );

  // Loading state with better visual treatment
  const LoadingState = () => (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600 font-medium">Loading chart data...</p>
      </div>
    </div>
  );

  // Only render the chart when in browser environment
  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart area with fixed proportion */}
      <div className="w-full" style={{ height: "200px" }}>
        {!isBrowser ? (
          <LoadingState />
        ) : isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : totalApplicants === 0 ? (
          <EmptyState />
        ) : (
          <Pie data={pieChartData} options={options} />
        )}
      </div>

      {/* Company Legend - Horizontal Scrollable Row for medium screens */}
      {isBrowser && !isLoading && !error && totalApplicants > 0 && (
        <div className="mt-4 w-full">
          <div className="flex flex-wrap gap-3 overflow-x-auto overflow-y-hidden pb-2 max-h-32">
            {chartData.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-xs whitespace-nowrap px-2 py-1 rounded-full bg-gray-50"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <span className="font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid - Fixed layout that matches screenshot */}
      {isBrowser && !isLoading && !error && totalApplicants > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-purple-50 p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600">Average</p>
            <p className="text-xl font-semibold text-purple-600">
              {(totalApplicants / chartData.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600">Top Company</p>
            <p className="text-sm font-semibold text-orange-600 truncate">
              {chartData.length > 0
                ? chartData.reduce((max, item) =>
                    item.applicants > max.applicants ? item : max
                  ).name
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
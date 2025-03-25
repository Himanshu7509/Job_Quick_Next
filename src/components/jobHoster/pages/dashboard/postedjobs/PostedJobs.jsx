import React, { useState } from 'react';
import { FaBriefcase, FaSearch } from 'react-icons/fa';

const PostedJobs = ({ jobs, error }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Job Postings</h2>
        <div className="w-full sm:w-auto relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="p-4">
        { error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No jobs posted yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-semibold">
                  <FaBriefcase />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{job.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {job.jobType} • {job.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedJobs;
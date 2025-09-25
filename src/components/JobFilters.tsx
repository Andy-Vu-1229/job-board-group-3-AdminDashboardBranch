import React from 'react';
import './JobFilters.css';

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedJobType: string;
  onJobTypeChange: (type: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  jobCount: number;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedJobType,
  onJobTypeChange,
  selectedIndustry,
  onIndustryChange,
  jobCount
}) => {
  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'internship', label: 'Internship' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'contract', label: 'Contract' }
  ];

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Marketing & Advertising', label: 'Marketing & Advertising' },
    { value: 'Research & Development', label: 'Research & Development' },
    { value: 'Design & Creative', label: 'Design & Creative' },
    { value: 'Finance & Banking', label: 'Finance & Banking' }
  ];

  return (
    <div className="job-filters">
      <div className="filters-header">
        <h2>Job Opportunities</h2>
        <span className="job-count">{jobCount} positions available</span>
      </div>
      
      <div className="filters-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Search jobs"
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <label htmlFor="job-type-filter">Job Type</label>
            <select
              id="job-type-filter"
              value={selectedJobType}
              onChange={(e) => onJobTypeChange(e.target.value)}
              className="filter-select"
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="industry-filter">Industry</label>
            <select
              id="industry-filter"
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="filter-select"
            >
              {industries.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
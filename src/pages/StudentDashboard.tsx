import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { JobPosting } from '../types';
import { mockJobPostings } from '../data/mockData';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  useEffect(() => {
    // Simulate loading delay
    const loadJobs = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(mockJobPostings);
      setFilteredJobs(mockJobPostings);
      setLoading(false);
    };

    loadJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search and filter criteria
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(job => job.industry === selectedIndustry);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedJobType, selectedIndustry]);

  const handleApply = (jobId: string) => {
    // Placeholder for apply functionality
    alert(`Apply functionality for job ${jobId} will be implemented soon!`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navigation />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Discover your next opportunity</p>
          </div>

          <JobFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedJobType={selectedJobType}
            onJobTypeChange={setSelectedJobType}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            jobCount={filteredJobs.length}
          />

          <div className="jobs-section">
            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
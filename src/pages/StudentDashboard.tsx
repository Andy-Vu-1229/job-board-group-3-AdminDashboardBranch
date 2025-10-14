import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { JobPosting } from '../types';
import { GraphQLService } from '../services/graphqlService';
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
    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobPostings = await GraphQLService.getApprovedJobs();
        console.log('Loaded jobs:', jobPostings); // Debug logging
        setJobs(jobPostings);
        setFilteredJobs(jobPostings);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        // Set empty array on error to show empty state
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const filterJobs = async () => {
      if (searchTerm || selectedJobType !== 'all' || selectedIndustry !== 'all') {
        try {
          const filtered = await GraphQLService.searchJobs(searchTerm, selectedJobType, selectedIndustry);
          setFilteredJobs(filtered);
        } catch (error) {
          console.error('Failed to filter jobs:', error);
          // Fallback to client-side filtering
          let filtered = jobs;

          if (searchTerm) {
            filtered = filtered.filter(job =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          if (selectedJobType !== 'all') {
            filtered = filtered.filter(job => job.jobType.toLowerCase() === selectedJobType.toLowerCase());
          }

          if (selectedIndustry !== 'all') {
            filtered = filtered.filter(job => job.industry === selectedIndustry);
          }

          setFilteredJobs(filtered);
        }
      } else {
        setFilteredJobs(jobs);
      }
    };

    filterJobs();
  }, [jobs, searchTerm, selectedJobType, selectedIndustry]);

  const handleApply = async (jobId: string) => {
    try {
      // Increment view count when user shows interest
      await GraphQLService.incrementJobViewCount(jobId);

      // Find the job to get contact method
      const job = filteredJobs.find(j => j.id === jobId);
      if (job) {
        if (job.contactMethod.type === 'EMAIL') {
          // Open email client
          const subject = encodeURIComponent(`Application for ${job.title}`);
          const body = encodeURIComponent(`Dear Hiring Manager,\n\nI am interested in applying for the ${job.title} position at ${job.company}.\n\nBest regards`);
          window.open(`mailto:${job.contactMethod.value}?subject=${subject}&body=${body}`);
        } else if (job.contactMethod.type === 'CAREERS_PAGE') {
          // Open careers page in new tab
          window.open(job.contactMethod.value, '_blank');
        }
      }
    } catch (error) {
      console.error('Error handling apply action:', error);
      alert('Unable to process application. Please try again.');
    }
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
            <p>Discover your next opportunity with DawgsConnect</p>
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
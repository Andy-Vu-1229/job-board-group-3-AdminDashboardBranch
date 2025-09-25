import { JobPosting } from '../types';
import './JobCard.css';

interface JobCardProps {
  job: JobPosting;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'internship':
        return 'job-type-internship';
      case 'full-time':
        return 'job-type-fulltime';
      case 'contract':
        return 'job-type-contract';
      default:
        return 'job-type-default';
    }
  };

  const handleApplyClick = () => {
    onApply(job.id);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <div className="company-info">
            <span className="company-name">{job.companyName}</span>
            <span className="industry">{job.industry}</span>
          </div>
        </div>
        <div className={`job-type-badge ${getJobTypeColor(job.jobType)}`}>
          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
        </div>
      </div>

      <div className="job-card-body">
        <p className="job-description">{job.description}</p>
        
        <div className="job-details">
          <div className="skills-section">
            <h4>Required Skills</h4>
            <div className="skills-list">
              {job.requiredSkills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 4 && (
                <span className="skill-tag more-skills">
                  +{job.requiredSkills.length - 4} more
                </span>
              )}
            </div>
          </div>

          <div className="job-meta">
            <div className="deadline">
              <span className="meta-label">Deadline:</span>
              <span className="meta-value">{formatDeadline(job.applicationDeadline)}</span>
            </div>
            <div className="contact-method">
              <span className="meta-label">Apply via:</span>
              <span className="meta-value">
                {job.contactMethod.type === 'email' ? 'Email' :
                 job.contactMethod.type === 'careers_page' ? 'Company Website' : 'Phone'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
          <span className="stat">
            <span className="stat-number">{job.viewCount}</span>
            <span className="stat-label">views</span>
          </span>
          <span className="stat">
            <span className="stat-number">{job.applicationCount}</span>
            <span className="stat-label">applications</span>
          </span>
        </div>
        <button 
          className="apply-button"
          onClick={handleApplyClick}
          aria-label={`Apply for ${job.title} at ${job.companyName}`}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('job-board');

  const tabs = [
    { id: 'job-board', label: 'MIS Student Job Board', active: true },
    { id: 'applications', label: 'My Applications', active: false },
    { id: 'profile', label: 'My Profile', active: false }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // TODO: Add navigation logic when routes are implemented
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="nav-user-section">
            <div className="user-info">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="user-role">
                {user?.role === 'student' ? 'Student' : user?.role}
              </span>
            </div>
            <button onClick={logout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
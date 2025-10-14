import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('job-board');

  const tabs = [
    { id: 'job-board', label: 'DawgsConnect', route: '/dashboard' },
    { id: 'create-job', label: 'Create a Job Posting', route: '/create-job' },
    { id: 'applications', label: 'My Applications', route: '/applications' },
    { id: 'profile', label: 'My Profile', route: '/profile' }
  ];

  useEffect(() => {
    // Set active tab based on current route
    const tabRoutes = [
      { id: 'job-board', route: '/dashboard' },
      { id: 'create-job', route: '/create-job' },
      { id: 'applications', route: '/applications' },
      { id: 'profile', route: '/profile' }
    ];
    const currentTab = tabRoutes.find(tab => tab.route === location.pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.route === '/applications' || tab.route === '/profile') {
        // For now, show placeholder for unimplemented routes
        alert(`${tab.label} page coming soon!`);
      } else {
        navigate(tab.route);
      }
    }
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
                {user?.role === 'STUDENT' ? 'Student' :
                    user?.role === 'COMPANY_REP' ? 'Company Rep' :
                      user?.role === 'ADMIN' ? 'Admin' : user?.role}
              </span>
            </div>
            <button onClick={() => logout()} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
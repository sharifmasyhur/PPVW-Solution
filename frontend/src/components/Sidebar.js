import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>BudgetEase</h2>
      <ul>
        <li onClick={() => navigate('/profile')}>Profile</li>
        <li onClick={() => navigate('/transaction')}>Transaction</li>
        <li onClick={() => navigate('/donation')}>Donation</li>
        <li onClick={() => navigate('/report')}>Report</li>
        <li onClick={() => navigate('/logout')}>Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
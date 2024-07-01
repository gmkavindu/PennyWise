import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AccountSettings from './AccountSettings';
import PersonalInformation from './PersonalInformation';
import ThemeAppearance from './ThemeAppearance';

const SettingsPage = () => {
  const styles = {
    container: {
      padding: '20px',
    },
    nav: {
      marginBottom: '20px',
    },
    ul: {
      listStyleType: 'none',
      padding: 0,
      display: 'flex',
      gap: '15px',
    },
    li: {
      display: 'inline',
    },
    link: {
      textDecoration: 'none',
      color: 'var(--link-color)',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/settings/account" style={styles.link}>Account Settings</Link></li>
          <li style={styles.li}><Link to="/settings/personal" style={styles.link}>Personal Information</Link></li>
          <li style={styles.li}><Link to="/settings/theme" style={styles.link}>Theme and Appearance</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/personal" element={<PersonalInformation />} />
        <Route path="/settings/theme" element={<ThemeAppearance />} />
      </Routes>
    </div>
  );
};

export default SettingsPage;

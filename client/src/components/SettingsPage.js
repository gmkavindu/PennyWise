// SettingsPage.js

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Remove unused import 'useParams'
import AccountSettings from './AccountSettings';
import PersonalInformation from './PersonalInformation';
import ThemeAppearance from './ThemeAppearance';

const SettingsPage = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/settings/account">Account Settings</Link></li>
          <li><Link to="/settings/personal">Personal Information</Link></li>
          <li><Link to="/settings/notifications">Notification Preferences</Link></li>
          <li><Link to="/settings/theme">Theme and Appearance</Link></li>
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

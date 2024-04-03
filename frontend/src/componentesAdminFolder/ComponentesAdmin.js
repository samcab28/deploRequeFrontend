import React, { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';

const ComponentesAdmin = () => {
  const [currentScreen, setCurrentScreen] = useState(null);

  return (
    <div className= 'blankContainer' style={{ display: 'flex' }}>
      <SidebarAdmin setCurrentScreen={setCurrentScreen} />
      <div style={{ flex: 1 }}>
        {currentScreen}
      </div>
    </div>
  );
};

export default ComponentesAdmin;

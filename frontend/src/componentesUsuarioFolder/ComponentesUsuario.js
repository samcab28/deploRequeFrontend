import React, {useState} from 'react';
import SidebarUsuario from './SidebarUsuario';


const ComponentesUsuario = () => {
  const [currentScreen, setCurrentScreen] = useState(null);

  return (
    <div style={{ display: 'flex' }}>
      <SidebarUsuario setCurrentScreen={setCurrentScreen} />
      <div style={{ flex: 1 }}>
        {currentScreen}
      </div>
    </div>
  );
};

export default ComponentesUsuario;

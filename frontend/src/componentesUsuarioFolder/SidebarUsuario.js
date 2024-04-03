import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//import del molde del dropdown
import DropDown from '../componets/common/dropdown';

//import de pantallas de foro usuario
import ForoFoUsu from './pantallasUsuario/foroUsuario/ForoFoUsu';

//import de pantallas de mi equipo
import EquipoEquiUsu from './pantallasUsuario/miEquipo/EquipoEquiUsu';

//import de pantallas de mi proyecto
import BCProUsu from './pantallasUsuario/miProyecto/BCProUsu';
import InformeProUsu from './pantallasUsuario/miProyecto/InformeProUsu';
import TareasProUsu from './pantallasUsuario/miProyecto/TareasProUsu';


const SidebarWrapper = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: #fff;
  padding: 20px;
`;

const SidebarHeader = styled.h2`
  margin-bottom: 20px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
`;



const StyledButton = styled.button`
  width: 50%;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const SidebarButton = () => {
  return (
    <StyledButton as={Link} to="/">
      Volver al inicio
    </StyledButton>
  );
};

const Sidebar = ({ setCurrentScreen }) => {
  const handleOptionClick = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <SidebarWrapper>
      <SidebarHeader>Usuarios</SidebarHeader>
      <SidebarNav style={{}}>
        <DropDown position='flex' className={'space-x-8'} title={'Mi Proyecto'} options={[
          { text: 'Informe', onClick: () => { handleOptionClick(<InformeProUsu />) } },
          { text: 'Burndown Chart', onClick: () => { handleOptionClick(<BCProUsu />) } },
          { text: 'Tareas', onClick: () => { handleOptionClick(<TareasProUsu />) } },
        ]} />
        <DropDown position='flex' className={'space-x-8'} title={'Mi Equipo'} options={[
          { text: 'Equipo', onClick: () => { handleOptionClick(<EquipoEquiUsu />)} },
        ]} />
        <DropDown position='flex' className={'space-x-8'} title={'Foro'} options={[
          { text: 'Foro general', onClick: () => { handleOptionClick(<ForoFoUsu />) } }
        ]} />
        <SidebarButton />
      </SidebarNav>
    </SidebarWrapper>
  );
};


export default Sidebar;


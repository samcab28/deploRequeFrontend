import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//importar el molde del dropdown
import DropDown from '../componets/common/dropdown';

//importaciones de pantallas de proyectos
import CrearProAd from './pantallasAdmin/proyectos/CrearProAd';
import ConsultarProAd from './pantallasAdmin/proyectos/ConsultarProAd';
import ModificarProAd from './pantallasAdmin/proyectos/TareasProAd';
import CrearReunionProAd from './pantallasAdmin/proyectos/CrearReunionProAd';
import ConsultaReuPro from './pantallasAdmin/proyectos/ConsultaReunioProAd';

//importaciones de pantalla de consulta 
import ConsultarColAd from './pantallasAdmin/colaboradores/ConsultarColAd';
import CrearColAd from './pantallasAdmin/colaboradores/CrearColAd';

//importaciones de pantalla de informes
import InformesInfAd from './pantallasAdmin/informes/InformesInfAd';

//importaciones de pantalla de foro
import ForoFoAd from './pantallasAdmin/foroAdmin/ForoFoAd';
import ForoFoCol from './pantallasAdmin/foroAdmin/ForoFoCol';

const SidebarWrapper = styled.div`
  width: 250px;
  height: 100vh;
  background-color: rgb(31, 31, 31);
  border-right-style: double;
  border-right-color: rgb(0, 96, 128);
  border-right-width: 6px;
  color: #fff;
  padding: 25px;
`;

const SidebarHeader = styled.h2`
  margin-bottom: 20px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled.button`
  cursor: pointer;
  margin-top:5px;
  margin-left: 3px;
  &:hover{
    background: rgb(102, 0, 0);
  }
`;

const SidebarButton = () => {
  return (
    <StyledButton className = 'botonSalir' as={Link} to="/" >
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
      <SidebarHeader>Administradores</SidebarHeader>
      <SidebarNav>
        <DropDown position='flex' title={'Proyectos'} options={[
          { text: 'Crear Proyecto', onClick: () => { handleOptionClick(<CrearProAd />) } },
          { text: 'Consultar Proyecto', onClick: () => { handleOptionClick(<ConsultarProAd />) } },
          { text: 'Tareas', onClick: () => { handleOptionClick(<ModificarProAd />) } },
          { text: 'Crear reunion', onClick: () => { handleOptionClick(<CrearReunionProAd/>) } },
          { text: 'Consultar reunion', onClick: () => { handleOptionClick(<ConsultaReuPro/>) } },
        ]} />
        <DropDown position='flex' title={'Colaboradores'} options={[
          { text: 'Crear', onClick: () => { handleOptionClick(<CrearColAd/>) } },
          { text: 'Consultar', onClick: () => { handleOptionClick(<ConsultarColAd />) } }
        ]} />
        <DropDown position='flex' title={'Informes'} options={[
          { text: 'Informes', onClick: () => { handleOptionClick(<InformesInfAd />)} }
        ]} />
        <DropDown position='flex' title={'Foro'} options={[
          { text: 'Foro general admin', onClick: () => { handleOptionClick(<ForoFoAd />)} },
          { text: 'Foro general colab', onClick: () => { handleOptionClick(<ForoFoCol />)} }
        ]} />
        
        <SidebarButton />
      </SidebarNav>
    </SidebarWrapper>
  );
};

export default Sidebar;

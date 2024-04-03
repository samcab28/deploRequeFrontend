import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const InformeProUsu = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [companions, setCompanions] = useState([]);
  const [username, setUsername] = useState('');

  // Obtener el nombre de usuario del localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proyecto');
      console.log('Proyectos obtenidos:', response.data);
      setProjectsList(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchCompanionsInfo = async (companionId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/colaborador/${companionId}`);
      console.log('Respuesta del compañero:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching companion info:', error);
      return null;
    }
  };

  const handleProjectSelect = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/proyecto/${selectedProjectId}`);
      console.log('Proyecto seleccionado:', response.data);
      const project = response.data;

      const companionsInfoPromises = project.colaboradores.map(async companionId => {
        const companionInfo = await fetchCompanionsInfo(companionId);
        return { ...companionInfo, projectName: project.nombre };
      });

      const companionsInfo = await Promise.all(companionsInfoPromises);
      console.log('Información de compañeros:', companionsInfo);
      setCompanions(companionsInfo.filter(info => info.nombre !== username));
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  return (
    <div>
      <h1 style={{color:"black"}}>Mi equipo de trabajo</h1>
      <div>
        <label htmlFor="projectSelect">Selecciona un proyecto:</label>
        <select id="projectSelect" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Selecciona un proyecto</option>
          {projectsList.map(project => (
            <option key={project._id} value={project._id}>{project.nombre}</option>
          ))}
        </select>
        <button onClick={handleProjectSelect}>Seleccionar</button>
      </div>
      {companions.length > 0 && (
        <div>
          <h2>Compañeros de trabajo:</h2>
          {companions.map(companion => (
            <div key={companion._id} style={{backgroundColor: 'lightblue', borderRadius: '5px', padding: '10px', marginBottom: '10px'}}>
              <h3 style={{color:"black"}} >{companion.nombre}</h3>
              <p style={{color:"black"}}><strong>Correo:</strong> {companion.correo}</p>
              <p style={{color:"black"}}><strong>Teléfono:</strong> {companion.telefono}</p>
              <p style={{color:"black"}}><strong>Proyecto:</strong> {companion.projectName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InformeProUsu;
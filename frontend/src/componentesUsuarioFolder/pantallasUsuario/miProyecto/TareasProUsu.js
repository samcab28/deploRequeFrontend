import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TareasProUsu = () => {
  const [tareas, setTareas] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [responsablesMap, setResponsablesMap] = useState({});

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

  const fetchResponsableName = async (responsableId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/colaborador/${responsableId}`);
      const responsable = response.data;
      return responsable.nombre; 
    } catch (error) {
      console.error('Error fetching responsable:', error);
      return 'Desconocido';
    }
  };

  const handleProjectSelect = async () => {
    try {
      console.log('Proyecto seleccionado:', selectedProjectId);
      const response = await axios.get(`http://localhost:4000/api/proyecto/${selectedProjectId}`);
      console.log('Respuesta del servidor:', response.data);
      const project = response.data;
      setTareas(project.tareas);
      console.log('Tareas del proyecto:', project.tareas);

      // Crear un mapa de responsables para evitar múltiples solicitudes HTTP para el mismo ID de responsable
      const uniqueResponsableIds = new Set(project.tareas.map(tarea => tarea.responsable));
      const newResponsablesMap = {};
      for (const responsableId of uniqueResponsableIds) {
        newResponsablesMap[responsableId] = await fetchResponsableName(responsableId);
      }
      setResponsablesMap(newResponsablesMap);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  return (
    <div style={{ color: 'black' }}>
      <h1 style={{color:"black"}}>Tareas de Proyecto</h1>
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
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '10px', marginRight: '10px' }}>
          <h2>Pendiente</h2>
          {tareas.filter(tarea => tarea.estado === 'Pendiente').map((tarea, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid black' }}>
              <h3 style={{color: "black"}}>{tarea.nombre}</h3>
              <p style={{color: "black"}}><strong>Descripción:</strong> {tarea.descripcion}</p>
              <p></p>
              <p style={{color: "black"}}><strong>Responsable:</strong> {responsablesMap[tarea.responsable]}</p>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '10px', marginRight: '10px' }}>
          <h2>En Progreso</h2>
          {tareas.filter(tarea => tarea.estado === 'En Progreso').map((tarea, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid black' }}>
              <h3 style={{color: "black"}}>{tarea.nombre}</h3>
              <p style={{color: "black"}}><strong>Descripción:</strong> {tarea.descripcion}</p>
              <p></p>
              <p style={{color: "black"}}><strong>Responsable:</strong> {responsablesMap[tarea.responsable]}</p>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '10px' }}>
          <h2>Terminada</h2>
          {tareas.filter(tarea => tarea.estado === 'Terminada').map((tarea, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid black' }}>
              <h3 style={{color: "black"}}>{tarea.nombre}</h3>
              <p style={{color: "black"}}><strong>Descripción:</strong> {tarea.descripcion}</p>
              <p></p>
              <p style={{color: "black"} }><strong>Responsable:</strong> {responsablesMap[tarea.responsable]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TareasProUsu;

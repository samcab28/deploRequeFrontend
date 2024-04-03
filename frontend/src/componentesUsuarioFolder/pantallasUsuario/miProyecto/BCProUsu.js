import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const BCProUsu = () => {
  const [burndownData, setBurndownData] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectsList, setProjectsList] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/proyecto');
      setProjectsList(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectSelect = async () => {
    try {
      const response = await axios.get(`https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/burndown/${selectedProjectId}`);
      setBurndownData(response.data);
    } catch (error) {
      console.error('Error fetching burndown data:', error);
    }
  };

  return (
    <div>
      <h1 style={{ color: "black" }}>Burndown Chart del Proyecto</h1>
      <div>
        <label htmlFor="projectSelect">Selecciona un proyecto:</label>
        <select id="projectSelect" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Selecciona un proyecto</option>
          {projectsList?.map(project => (
            <option key={project._id} value={project._id}>{project.nombre}</option>
          ))}
        </select>
        <button onClick={handleProjectSelect}>Seleccionar</button>
      </div>
      {burndownData && (
        <div style={{ width: '100%', height: '500px' }}>
          <BurndownChart burndownData={burndownData} />
        </div>
      )}
    </div>
  );
};

const BurndownChart = ({ burndownData }) => {
  const { totalWork, remainingWork } = burndownData.burndownData; // Acceder directamente a burndownData
  const completedWork = totalWork - remainingWork;

  const data = {
    labels: ['Trabajo Restante', 'Trabajo Pendiente'],
    datasets: [
      {
        label: 'Trabajo Restante',
        data: [totalWork, 0], // Se invierten los datos para que la línea empiece desde arriba
        fill: false,
        borderColor: 'red',
      },
      {
        label: 'Trabajo Pendiente',
        data: [totalWork, -(completedWork) + totalWork  ], // Se invierten los datos para que la línea empiece desde arriba
        fill: false,
        borderColor: 'green',
      },
    ],
  };

  return (
    <div>
      <h2>Burndown Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default BCProUsu;

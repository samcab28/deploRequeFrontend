import React, { useState, useEffect, useCallback } from 'react'; 
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { CategoryScale } from 'chart.js'; 
Chart.register(CategoryScale);

const InformeProUsu = () => {
  const [tareasData, setTareasData] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectsList, setProjectsList] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proyecto');
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
      const response = await axios.get(`http://localhost:4000/api/proyecto/${selectedProjectId}`);
      const project = response.data;

      const data = {
        labels: project.tareas.map(tarea => tarea.nombre),
        datasets: [{
          label: 'Estado de las tareas',
          data: project.tareas.map(tarea => {
            switch (tarea.estado) {
              case 'Pendiente':
                return 1;
              case 'En Progreso':
                return 2;
              case 'Terminada':
                return 3;
              default:
                return 0;
            }
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      };

      setTareasData(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  return (
    <div>
      <h1 style={{color: 'Black'}}>Informe de tareas de proyectos</h1>
      <h2 style={{color: 'Black'}}>1: Pendiente, 2: En Progeso, 3: Terminada</h2>
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
      {tareasData && (
        <div style={{ width: '100%', height: '500px' }}>
          <Bar data={tareasData} />
        </div>
      )}
    </div>
  );
}; 

export default InformeProUsu;

import React, { useState, useEffect } from 'react'; 
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

const InformesInfAd = () => {
  const [tareasData, setTareasData] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de los proyectos desde el backend
    const fetchProyectosData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/proyecto'); // Endpoint para obtener los proyectos
        const proyectos = response.data;

        // Procesar los datos de las tareas para la gráfica
        const data = {
          labels: [], // Nombres de las tareas en el eje X
          datasets: [{
            label: 'Estado de las tareas',
            data: [],
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

        // Recorrer los proyectos para extraer las tareas y sus estados
        proyectos.forEach(proyecto => {
          proyecto.tareas.forEach(tarea => {
            data.labels.push(tarea.nombre); // Agregar el nombre de la tarea al eje X
            switch (tarea.estado) {
              case 'Pendiente':
                data.datasets[0].data.push(1); // Agregar un valor para pendiente
                break;
              case 'En Progreso':
                data.datasets[0].data.push(2); // Agregar un valor para en progreso
                break;
              case 'Terminada':
                data.datasets[0].data.push(3); // Agregar un valor para terminada
                break;
              default:
                data.datasets[0].data.push(0); // Valor por defecto
            }
          });
        });

        setTareasData(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    // Llamar a la función para obtener los datos de los proyectos al cargar el componente
    fetchProyectosData();
  }, []);

  const opciones = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className='informe' style={{ width: '100%', height: '500px' }}>
      <h1>Pantalla de informes de tareas de proyectos</h1>
      <h2 style={{color: 'white'}}>1: Pendiente, 2: En Progeso, 3: Terminada</h2>
      {tareasData && (
        <Bar data={tareasData} options={opciones} />
      )}
    </div>
  );
}; 

export default InformesInfAd;

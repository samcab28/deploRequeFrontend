import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminStyle.css';

const CrearProyecto = () => {
  const [nombre, setNombre] = useState('');
  const [recursos, setRecursos] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [estado, setEstado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha_inicio, setFecha_inicio] = useState('');
  const [responsable, setResponsable] = useState('');
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState([]);
  const [responsablesDisponibles, setResponsablesDisponibles] = useState([]);
  const [datosGuardados, setDatosGuardados] = useState(null);

  useEffect(() => {
    // Obtener la lista de colaboradores disponibles
    axios.get('http://localhost:4000/api/colaborador')
      .then(response => {
        setColaboradoresDisponibles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los colaboradores:', error);
      });

    // Obtener la lista de responsables disponibles
    axios.get('http://localhost:4000/api/Admin')
      .then(response => {
        setResponsablesDisponibles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los responsables:', error);
      });
  }, []);

  const handleGuardar = () => {
    // Check if any field is undefined
    if (!nombre || !recursos || !presupuesto || !colaboradores || !estado || !descripcion ||
        !fecha_inicio || !responsable    ) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return; // Exit the function early
    }
  
    const datos = { nombre, recursos, presupuesto, colaboradores, estado, descripcion, fecha_inicio, responsable };
    setDatosGuardados(datos);
  
    // Enviar los datos al servidor para crear el proyecto
    axios.post('http://localhost:4000/api/proyecto/', datos)
      .then(response => {
        console.log('Proyecto creado exitosamente:', response.data);
      })
      .catch(error => {
        console.error('Error al crear el proyecto:', error);
      });
  };
  ;

  return (
    <div  className= 'SimpleContainer'>
      <h1>Pantalla de Crear Proyectos de Administradores</h1>
      <div className = 'Label' >
        Nombre:
        <input className='TextField' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Recursos:
        <input className='TextField' type="text" value={recursos} onChange={(e) => setRecursos(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Presupuesto:
        <input className='TextField' type="text" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Colaboradores:
        <select className='DropDownSimple' multiple value={colaboradores} onChange={(e) => setColaboradores(Array.from(e.target.selectedOptions, option => option.value))}>
          {colaboradoresDisponibles.map(colaborador => (
            <option key={colaborador._id} value={colaborador._id}>{colaborador.nombre} - {colaborador._id}</option>
          ))}
        </select>
      </div>
      <br />
      <div className = 'Label'>
        Estado:
        <input className='TextField' type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Descripción:
        <textarea className='TextField' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Fecha de Inicio:
        <input className='TextField' type="date" value={fecha_inicio} onChange={(e) => setFecha_inicio(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Responsable:
        <select className='DropDownSimple' value={responsable} onChange={(e) => setResponsable(e.target.value)}>
          {responsablesDisponibles.map(responsable => (
            <option key={responsable._id} value={responsable._id}>{responsable.nombre} - {responsable._id}</option>
          ))}
        </select>
      </div>
      <br />
      <button className = 'Button' onClick={handleGuardar}>Guardar</button>
      {datosGuardados && (
        <div>
          <h2>Datos guardados:</h2>
          <pre>{JSON.stringify(datosGuardados, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CrearProyecto;

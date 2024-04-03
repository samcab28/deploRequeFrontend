import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearReunion = () => {
  const [proyectoId, setProyectoId] = useState('');
  const [tema, setTema] = useState('');
  const [medio, setMedio] = useState('');
  const [link, setLink] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [duracionHoras, setDuracionHoras] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [proyectosList, setProyectosList] = useState([]);
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState([]);
  const [administradoresDisponibles, setAdministradoresDisponibles] = useState([]);
  const [datosGuardados, setDatosGuardados] = useState(null);

  useEffect(() => {
    loadProyectosList();
    loadColaboradoresDisponibles();
    loadAdministradoresDisponibles();
  }, []);

  const enviarCorreo = async (datosCorreo) => {
    try {
      const response = await axios.post('http://localhost:4000/api/sendEmail', datosCorreo);
      console.log('Correo enviado correctamente:', response.data);
      // Aquí puedes manejar la respuesta del servidor si es necesario
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      // Aquí puedes manejar cualquier error que ocurra durante la solicitud
    }
  };

  const loadProyectosList = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proyecto');
      setProyectosList(response.data);
    } catch (error) {
      console.error('Error loading projects list:', error);
    }
  };

  const loadColaboradoresDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/colaborador');
      setColaboradoresDisponibles(response.data);
    } catch (error) {
      console.error('Error loading available collaborators:', error);
    }
  };

  const loadAdministradoresDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/Admin');
      setAdministradoresDisponibles(response.data);
    } catch (error) {
      console.error('Error loading available administrators:', error);
    }
  };

  const handleCrearReunion = async () => {
    if (!proyectoId.trim() || !tema || !medio || !link || !fecha || !colaboradores || !administradores || !duracionHoras) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return; // Salir de la función temprano si falta algún campo
    }
  
    const colaboradoresSeleccionados = colaboradores.concat(administradores);
    const correosColaboradores = colaboradoresSeleccionados.map(colaborador => colaborador.correo);
  
    const datos = {
      proyecto: proyectoId.trim(),
      tema,
      medio,
      link,
      fecha: new Date(`${fecha}T${hora}:00`),
      duracionHoras,
      colaboradores: colaboradoresSeleccionados,
    };
  
    const correosParticipantes = [...correosColaboradores]; // Copia los correos de los colaboradores
    // Concatena los correos de los administradores a la lista
    administradores.forEach(administrador => {
      correosParticipantes.push(administrador.correo);
    });

    try {
      const response = await axios.get(`http://localhost:4000/api/proyecto/${proyectoId.trim()}`);
      if (!response.data) {
        alert('No se encontró ningún proyecto con el ID proporcionado!');
        return; // Salir de la función temprano si no se encontró el proyecto
      }
      alert('Reunión creada.');

      // Crear la reunión en el backend
      await axios.post('http://localhost:4000/api/reunion', datos);

      // Enviar correos electrónicos a los participantes de la reunión
      const asunto = `Nueva reunión sobre el tema: ${tema}`;
      const mensaje = `Se ha programado una nueva reunión sobre el tema: ${tema}. La reunión se llevará a cabo el ${fecha} a las ${hora} horas. Por favor, únete a la reunión a través del siguiente enlace: ${link}.`;
      const datosCorreo = {
        listaCorreos: correosParticipantes,
        asunto,
        mensaje
      };
      enviarCorreo(datosCorreo);

      console.log('Reunión creada exitosamente');
      // Limpiar los campos después de crear la reunión
      setProyectoId('');
      setTema('');
      setMedio('');
      setLink('');
      setFecha('');
      setHora('');
      setDuracionHoras('');
      setColaboradores([]);
    } catch (error) {
      alert('No se encontró ningún proyecto con el ID proporcionado.');
      setProyectoId('');
      setTema('');
      setMedio('');
      setLink('');
      setFecha('');
      setHora('');
      setDuracionHoras('');
      setColaboradores([]);
      console.error('Error al crear la reunión:', error);
    }
  };

  return (
    <div className='SimpleContainer'>
      <h1>Pantalla de Crear Reunión de Proyectos de Administradores</h1>
      <p>
        ID del Proyecto:
        <input className='TextField' type="text" value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} />
      </p>
      <br />
      <p>
        Tema:
        <input className='TextField' type="text" value={tema} onChange={(e) => setTema(e.target.value)} />
      </p>
      <br />
      <p>
        Medio:
        <input className='TextField' type="text" value={medio} onChange={(e) => setMedio(e.target.value)} />
      </p>
      <br />
      <p>
        Enlace:
        <input className='TextField' type="text" value={link} onChange={(e) => setLink(e.target.value)} />
      </p>
      <br />
      <p>
        Fecha:
        <input className='TextField' type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </p>
      <br />
      <p>
        Hora:
        <input className='TextField' type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
      </p>
      <br />
      <p>
        Duración en Horas:
        <input className='TextField' type="number" value={duracionHoras} onChange={(e) => setDuracionHoras(e.target.value)} />
      </p>
      <br />
      <p>
  Colaboradores:
  <select className='DropDownSimple' multiple value={colaboradores.map(colaborador => colaborador._id)} onChange={(e) => setColaboradores(Array.from(e.target.selectedOptions, option => colaboradoresDisponibles.find(colaborador => colaborador._id === option.value)))}>
    {colaboradoresDisponibles.map(colaborador => (
      <option key={colaborador._id} value={colaborador._id}>{colaborador.nombre} - {colaborador._id}</option>
    ))}
  </select>
</p>
<br />
<br />
<br />
<br />
<p>
  Administradores:
  <select className='DropDownSimple' multiple value={administradores.map(administrador => administrador._id)} onChange={(e) => setAdministradores(Array.from(e.target.selectedOptions, option => administradoresDisponibles.find(administrador => administrador._id === option.value)))}>
    {administradoresDisponibles.map(administrador => (
      <option key={administrador._id} value={administrador._id}>{administrador.nombre} - {administrador._id}</option>
    ))}
  </select>
</p>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button className='ButtonOffset' onClick={handleCrearReunion}>Crear Reunión</button>
      <div>
          <h3>Proyectos disponibles:</h3>
          <ul>
              {proyectosList.map((proyecto) => (
                  <li key={proyecto._id}>{proyecto._id} - {proyecto.nombre}</li>
              ))}
          </ul>
      </div>
      {datosGuardados && (
        <div>
          <h2>Datos guardados:</h2>
          <pre>{JSON.stringify(datosGuardados, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CrearReunion;

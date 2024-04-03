import React, { useState } from 'react';
import axios from 'axios';
import '../adminStyle.css';

const CrearColAd = () => {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('colaborador'); 
  const [datosGuardados, setDatosGuardados] = useState(null);

  const handleGuardar = async () => {
    const usuario = { nombre, cedula, correo, password: contrasena, departamento, telefono, estado, tipo: tipoUsuario };
  
     // Check if departamento, estado, or tipoUsuario is undefined
     if (!nombre || !cedula || !correo || !contrasena ||
      !departamento || !telefono || !estado || !tipoUsuario) {
    alert('Por favor, completa todos los campos antes de guardar.');
    return; // Exit the function early
  }
  
    try {
      const url = tipoUsuario === 'colaborador' ? 'http://localhost:4000/api/colaborador/' : 'http://localhost:4000/api/admin/';
      await axios.post(url, usuario);
      setDatosGuardados(usuario);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };
  
  

  return (
    <div className= 'simpleContainer'>
    <h1> Pantalla de Crear Usuarios</h1>
      
      <div className = 'Label'>
        Nombre:
        <input className='TextField' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Cédula:
        <input className='TextField' type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Correo:
        <input className='TextField' type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Password:
        <input className='TextField' type="text" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Departamento:
        <select className='DropDownSimple' value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
          <option value="">---</option>
          <option value="finanzas">Finanzas</option>
          <option value="limpieza">Limpieza</option>
          <option value="recursos humanos">Recursos Humanos</option>
          <option value="marketing">Marketing</option>
          <option value="gerencia">Gerencia</option>
        </select>
      </div>
      <br />
      <div className = 'Label'>
        Teléfono:
        <input className='TextField' type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <br />
      <div className = 'Label'>
        Estado:
        <select className='DropDownSimple' value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">---</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
        </select>
      </div>
      <br />
      
      <div className = 'Label'>
        Tipo de usuario:
        <select className='DropDownSimple' value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
          <option value="">---</option> {/* Change value to an empty string */}
          <option value="colaborador">Colaborador</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
     
      <br />
      <button className= 'Button' onClick={handleGuardar}>Guardar</button>
      {datosGuardados && (
        <div>
          <h2>Datos guardados:</h2>
          <pre>{JSON.stringify(datosGuardados, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CrearColAd;

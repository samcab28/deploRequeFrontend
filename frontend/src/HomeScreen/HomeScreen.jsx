import React, { useState } from 'react';
import axios from 'axios';

const HomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/login', { nombre, password });

      if (response && response.data !== null) {
        localStorage.setItem('username', nombre); // Guardar el nombre de usuario en el localStorage

        localStorage.setItem('userId', response.data.id); // Guardar el ID del usuario en el localStorage
        console.log("LOGEADO: ", response.data.role);
        // Redireccionar a la página correspondiente según el rol del usuario
        if (response.data.role === 'admin') {
          window.location.href = '/admin';
        } else if (response.data.role === 'usuario') {
          window.location.href = '/usuario';
        }
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div className='mainContainer'>
      <h1 className='titulo'>Iniciar Sesión</h1>
      <form>
        <div className='formContainer' >
          <label htmlFor="usuario" className="labelWithMargin" style={{ marginRight: '44px' }}>Usuario:</label>
          <input 
            type="text" 
            id="usuario" 
            name="usuario" 
            className="labelWithMargin inputField" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>
        <div className='formContainer' >
          <label htmlFor="contraseña" className="labelWithMargin">Contraseña:</label>
          <input 
            type="password" 
            id="contraseña" 
            name="contraseña" 
            className="labelWithMargin inputField" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
      </form>
      <div>
        <button onClick={handleLogin} className='button'>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default HomeScreen;



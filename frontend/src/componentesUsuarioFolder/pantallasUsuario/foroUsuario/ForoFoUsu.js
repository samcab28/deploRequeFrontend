import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminStyle.css';

function ForoFoUs() {
  const [mensaje, setMensaje] = useState('');
  const [mensajesForo, setMensajesForo] = useState([]);

  const fetchMessages = async () => {
    try {
        const response = await axios.get('https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/foro/660d97e3783f0dbbe89eba1a/mensaje');
        const mensajes = response.data;
        
        // Obtener el nombre y el departamento del autor de cada mensaje
        const mensajesConAutor = await Promise.all(mensajes.map(async (mensaje) => {
            const autor = await dataColab(mensaje.idAutor);
            
            if (!autor) {
              const admin = await dataAdmin(mensaje.idAutor);
              return {...mensaje, nombreAutor: admin.nombre, departamentoAutor: admin.departamento};
            }
            return {...mensaje, nombreAutor: autor.nombre, departamentoAutor: autor.departamento};
        }));
        
        setMensajesForo(mensajesConAutor);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
    }
};


  const dataColab = async (idAutor) => {
    try {
        // Realizar la solicitud GET para obtener la información del usuario
        const response = await axios.get(`https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/colaborador/${idAutor}`);

        console.log(response);
        if (!response || !response.data) {
            console.error('Error: Datos del administrador no encontrados');
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener datos del administrador:', error);
        return null;
    }
};

const dataAdmin = async (idAutor) => {
  try {
      // Realizar la solicitud GET para obtener la información del usuario
      const response = await axios.get(`https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/Admin/${idAutor}`);

      console.log(response);
      if (!response || !response.data) {
          console.error('Error: Datos del administrador no encontrados');
          return null;
      }

      return response.data;
  } catch (error) {
      console.error('Error al obtener datos del administrador:', error);
      return null;
  }
};

  useEffect(() => {
    fetchMessages();
  },[] );

  const handleChange = (e) => {
    setMensaje(e.target.value);
  };


  const enviarMensaje = async () => {

    try {

      //---------------------------------------------------------------------------
      // Obtener el ID del autor del localStorage
      const idAutor = localStorage.getItem('userId');
     
      // Verificar que el ID del autor esté presente
      if (!idAutor) {
        console.error('Error: ID del autor no encontrado en localStorage');
        return;
      }

      // Realizar la solicitud GET para obtener la información del usuario
      const response = await axios.get(`https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/colaborador/${idAutor}`);
      let nombreAutor = ' ';
      
      if (response && response.data) {
        //caso ser administrador
        nombreAutor = response.data.nombre;
        console.log(nombreAutor);
      } else {
        //caso ser colaborador
        const colab = await axios.get(`https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/colaborador/${idAutor}`);
        nombreAutor = colab.data.nombre;
        console.log(nombreAutor);
      }
      
     //---------------------------------------------------------------------------
    
     //const nombreAutor = response.data.nombre;
      // Realizar la solicitud POST para enviar el mensaje
      await axios.post(
        'https://ancient-savannah-86041-b59d8e70e572.herokuapp.com/api/foro/660d97e3783f0dbbe89eba1a/mensaje',
        { nombreAutor, idAutor, contenido: mensaje }
      );

      console.log('Mensaje enviado:', mensaje);
      setMensaje('');
      fetchMessages();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <div className="container">
      <h1 style = {{color: 'black'}}>Chat de colaboradores</h1>
      <div className="messages" style = {{color: 'black'}}>
    {mensajesForo.map((mensaje, index) => (
        <div key={index} className="message" >
            <p style = {{color: 'black'}}>{mensaje.nombreAutor} - {mensaje.departamentoAutor}: {mensaje.contenido}</p>
            <p style = {{color: 'black'}}>Creado en: {new Date(mensaje.createdAt).toLocaleString()}</p>
            <p></p>
        </div>
    ))}
</div>


      <div className="footer">
        <input type="text" value={mensaje} onChange={handleChange} />
        <button onClick={enviarMensaje}>Enviar mensaje</button>
      </div>
    </div>
  );
}

export default ForoFoUs;

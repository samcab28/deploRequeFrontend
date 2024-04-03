import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminStyle.css';

function ForoFoAd() {
  const [mensaje, setMensaje] = useState('');
  const [mensajesForo, setMensajesForo] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const fetchMessages = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/foro/660d97e3783f0dbbe89eba1a/mensaje');
        const mensajes = response.data;
        
        // Obtener el nombre y el departamento del autor de cada mensaje
        const mensajesConAutor = await Promise.all(mensajes.map(async (mensaje) => {
            const autor = await dataAdmin(mensaje.idAutor);
            
            if (!autor) {
              console.log("COLABORADOR");
              const colab = await dataColab(mensaje.idAutor);
              console.log(colab);
              return {...mensaje, nombreAutor: colab.nombre, departamentoAutor: colab.departamento};
            }
            return {...mensaje, nombreAutor: autor.nombre, departamentoAutor: autor.departamento};
        }));
        
        setMensajesForo(mensajesConAutor);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
    }
};

// Llamar a fetchMessages dentro de un useEffect para ejecutarlo de manera asíncrona
useEffect(() => {
    fetchMessages();
}, [triggerFetch]);



const dataAdmin = async (idAutor) => {
  try {
      // Realizar la solicitud GET para obtener la información del usuario
      const response = await axios.get(`http://localhost:4000/api/Admin/${idAutor}`);
      //console.log("HOLA MINCHUS: ", response);
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


const dataColab = async (idAutor) => {
  try {
      // Realizar la solicitud GET para obtener la información del usuario
      const response = await axios.get(`http://localhost:4000/api/colaborador/${idAutor}`);
      if (!response && !response.data) {
        console.error('Error: Datos del colaborador no encontrados');
        return null;
      }

      return response.data;
  } catch (error) {
      console.error('Error al obtener datos del colaborador:', error);
      return null;
  }
};

  useEffect(() => {
    fetchMessages();
  }, []);

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
      const response = await axios.get(`http://localhost:4000/api/Admin/${idAutor}`);
      let nombreAutor = ' ';
      
      if (response && response.data) {
        //caso ser administrador
        nombreAutor = response.data.nombre;
        console.log(nombreAutor);
      } else {
        //caso ser colaborador
        const colab = await axios.get(`http://localhost:4000/api/colaborador/${idAutor}`);
        nombreAutor = colab.data.nombre;
        console.log(nombreAutor);
      }
     //---------------------------------------------------------------------------
    
     //const nombreAutor = response.data.nombre;
      // Realizar la solicitud POST para enviar el mensaje
      await axios.post(
        'http://localhost:4000/api/foro/660d97e3783f0dbbe89eba1a/mensaje',
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
      <h1>Chat de colaboradores</h1>
      <div className="messages">
    {mensajesForo.map((mensaje, index) => (
        <div key={index} className="message">
            <p>{mensaje.nombreAutor} - {mensaje.departamentoAutor}: {mensaje.contenido}</p>
            <p>Creado en: {new Date(mensaje.createdAt).toLocaleString()}</p>
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

export default ForoFoAd;

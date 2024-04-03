import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../adminStyle.css';

const ConsultaReuPro = () => {
    const [searchId, setSearchId] = useState('');
    const [reunion, setReunion] = useState(null);
    const [reunionesList, setReunionesList] = useState([]);

    const [selectedField, setSelectedField] = useState('');
    const [newData, setNewData] = useState('');

    useEffect(() => {
        loadReunionesList();
    }, []);

    const loadReunionesList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/reunion');
            setReunionesList(response.data);
        } catch (error) {
            console.error('Error loading reuniones list:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/reunion/${searchId}`);
            setReunion(response.data);
        } catch (error) {
            console.error('Error searching for meeting:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/reunion/${reunion._id}`);
            setSearchId('');
            setReunion(null);
            loadReunionesList();
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            if (!selectedField) {
                console.error('No field selected for update');
                return;
            }
            if (!newData) {
                console.error('No new data provided');
                return;
            }
            await axios.put(`http://localhost:4000/api/reunion/${reunion._id}`, { [selectedField]: newData });
            setSearchId('');
            setReunion(null);
            loadReunionesList();
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    return (
        <div className='SimpleContainer'>
            <h1>Consulta y modificación de reuniones</h1>
            <input
                className='SearchBarOffset'
                type="text"
                placeholder="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button className='Button' onClick={handleSearch}>Search</button>
            {reunion && (
                <div>
                    <h3>Información de la Reunión:</h3>
                    <p>ID: {reunion._id}</p>
                    <p>Proyecto: {reunion.proyecto}</p>
                    <p>Tema: {reunion.tema}</p>
                    <p>Medio: {reunion.medio}</p>
                    <p>Link: {reunion.link}</p>
                    <p>Fecha: {reunion.fecha}</p>
                    <p>Duración en Horas: {reunion.duracionHoras}</p>
                    <p>Colaboradores: {reunion.colaboradores.join(', ')}</p>
                    <button className='buttonRojo' onClick={handleDelete}>Delete</button>
                    <br />
                    <br />
                    <div>
                        <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                            <option value="proyecto">Proyecto</option>
                            <option value="tema">Tema</option>
                            <option value="medio">Medio</option>
                            <option value="link">Link</option>
                            <option value="fecha">Fecha</option>
                            <option value="duracionHoras">Duración en Horas</option>
                            <option value="colaboradores">Colaboradores</option>
                        </select>
                        <input className='SearchBar2' type="text" value={newData} onChange={(e) => setNewData(e.target.value)} />
                        <button className='Button' onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            )}
            <div>
                <h3>Reuniones disponibles:</h3>
                <ul>
                    {reunionesList.map((reunion) => (
                        <li key={reunion._id}>
                            {reunion._id} - {reunion.tema}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ConsultaReuPro;

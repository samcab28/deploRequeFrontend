import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TareasProAd = () => {
    const [searchId, setSearchId] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [tareasProyecto, setTareasProyecto] = useState([]);
    const [proyectosList, setProyectosList] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [selectedTaskAssignee, setSelectedTaskAssignee] = useState('');
    const [colaboradoresList, setColaboradoresList] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/proyecto/${searchId}`);
            setProyecto(response.data);

            // Cargar tareas del proyecto con detalles de los responsables
            const tareas = await Promise.all(
                response.data.tareas.map(async (tarea) => {
                    const responsableResponse = await axios.get(`http://localhost:4000/api/colaborador/${tarea.responsable}`);
                    return {
                        nombre: tarea.nombre,
                        descripcion: tarea.descripcion,
                        responsable: responsableResponse.data.nombre
                    };
                })
            );
            setTareasProyecto(tareas);
        } catch (error) {
            console.error('Error searching for project:', error);
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/proyecto/${proyecto._id}/add-task`, {
                nombre: newTaskName,
                descripcion: newTaskDescription,
                responsable: selectedTaskAssignee
            });
            setNewTaskName('');
            setNewTaskDescription('');
            setSelectedTaskAssignee('');
            setProyecto(response.data.proyecto);
            loadProyectosList();
            handleSearch();
        } catch (error) {
            console.error('Error adding task:', error);
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

    const loadColaboradoresList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/colaborador');
            setColaboradoresList(response.data);
        } catch (error) {
            console.error('Error loading collaborators list:', error);
        }
    };

    useEffect(() => {
        loadProyectosList();
        loadColaboradoresList();
    }, []);

    return (
        <div className= 'SimpleContainer'>
            <h1>Asignación de tareas de los proyectos</h1>
            <input
                class = 'SearchBarOffset'
                type="text"
                placeholder="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button className= 'Button' onClick={handleSearch}>Search</button>
            {proyecto && (
                <div>
                    <h3>Información del Proyecto:</h3>
                    <p>ID: {proyecto._id}</p>
                    <p>Nombre: {proyecto.nombre}</p>
                    <p>Recursos: {proyecto.recursos}</p>
                    <p>Presupuesto: {proyecto.presupuesto}</p>
                    <p>Colaboradores: {proyecto.colaboradores.join(', ')}</p>
                    <p>Tareas:</p>
                    <ul>
                        {tareasProyecto.map((tarea, index) => (
                            <li key={index}>
                                <strong>Nombre:</strong> {tarea.nombre}<br />
                                <strong>Descripción:</strong> {tarea.descripcion}<br />
                                <strong>Responsable:</strong> {tarea.responsable}
                            </li>
                        ))}
                    </ul>
                    <p>Estado: {proyecto.estado}</p>
                    <p>Descripción: {proyecto.descripcion}</p>
                    <p>Fecha de Inicio: {proyecto.fecha_inicio}</p>
                    <p>Responsable: {proyecto.responsable}</p>
                  
                    <br />
                    <div>
                        <h3>Agregar Tarea:</h3>
                        <p>
                            Nombre:
                            <input className= 'TextField' type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} />
                        </p>
                        <br />
                        <p>
                            Descripción:
                            <textarea className= 'TextField' value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
                        </p>
                        <br />
                        <p>
                            Encargado:
                            <select className= 'DropDownSimple' value={selectedTaskAssignee} onChange={(e) => setSelectedTaskAssignee(e.target.value)}>
                                <option value="">Seleccionar encargado</option>
                                {colaboradoresList.map((colaborador) => (
                                    <option key={colaborador._id} value={colaborador._id}>{colaborador.nombre}</option>
                                ))}
                            </select>
                        </p>
                        <br />
                        <button className = 'ButtonOffset' onClick={handleAddTask}>Agregar Tarea</button>
                    </div>
                </div>
            )}
            <div>
                <h3>Proyectos:</h3>
                <ul>
                    {proyectosList.map((proyecto) => (
                        <li key={proyecto._id}>{proyecto._id} - {proyecto.nombre}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TareasProAd;

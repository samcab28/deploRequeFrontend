import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConsultarProAd = () => {
    const [searchId, setSearchId] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [proyectosList, setProyectosList] = useState([]);
    const [colaboradoresList, setColaboradoresList] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState('');
    const [editedTaskState, setEditedTaskState] = useState('');
    const [editedTaskDescription, setEditedTaskDescription] = useState('');
    const [editedTaskAssignee, setEditedTaskAssignee] = useState('');

    const [selectedField, setSelectedField] = useState('');
    const [newData, setNewData] = useState('');


    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/proyecto/${proyecto._id}`);
            handleSearch();
        } catch (error) {
            console.error('Error deleting collaborator:', error);
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
            await axios.put(`http://localhost:4000/api/proyecto/${proyecto._id}`, { [selectedField]: newData });
            handleSearch();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };
    
    

    const handleSearch = async () => {
        if (!searchId) {
            alert('Por favor, introduce un ID_Proyecto antes de realizar la búsqueda!');
            return; // Exit the function early
        }
        try {
            const response = await axios.get(`http://localhost:4000/api/proyecto/${searchId}`);
            // Check if response data is empty
            if (response && !response.data) {
                alert('No se encontró ningún proyecto con el ID proporcionado.');
                return; // Exit the function early
            }
            setProyecto(response.data);
            loadColaboradoresList();
        } catch (error) {
            alert('No se encontró ningún proyecto con el ID proporcionado.');
            console.error('Error searching for project:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:4000/api/proyecto/${proyecto._id}/delete-task/${taskId}`);
            handleSearch();
        } catch (error) {
            console.error('Error deleting collaborator:', error);
        }
    };

    const handleEditTask = async (taskId) => {
        try {
            await axios.put(`http://localhost:4000/api/proyecto/${proyecto._id}/edit-task/${taskId}`, {
                nombre: editedTaskName,
                descripcion: editedTaskDescription,
                responsable: editedTaskAssignee,
                estado: editedTaskState,
            });
            setEditingTask(null);
            setEditedTaskName('');
            setEditedTaskState('');
            setEditedTaskDescription('');
            setEditedTaskAssignee('');
            handleSearch();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    useEffect(() => {
        loadProyectosList();
    }, []);

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

    return (
        <div>
            <h1>Consulta y modificacion de los proyectos</h1>
            <input
                type="text"
                placeholder="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {proyecto && (
                <div>
                    <h3>Información del Proyecto:</h3>
                    <p>ID: {proyecto._id}</p>
                    <p>Nombre: {proyecto.nombre}</p>
                    <p>Recursos: {proyecto.recursos}</p>
                    <p>Presupuesto: {proyecto.presupuesto}</p>
                    <p>Colaboradores: {proyecto.colaboradores.join(', ')}</p>
                    <p>Estado: {proyecto.estado}</p>
                    <p>Descripción: {proyecto.descripcion}</p>
                    <p>Fecha de Inicio: {proyecto.fecha_inicio}</p>
                    <p>Responsable: {proyecto.responsable}</p>
                    <button onClick={handleDelete}>Delete</button>
                    <div>
                        <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                            <option value="nombre">Nombre</option>
                            <option value="recursos">Recursos</option>
                            <option value="presupuesto">Presupuesto</option>
                            <option value="estado">Estado</option>
                            <option value="descripcion">Descripcion</option>
                            <option value="fecha_inicio">Fecha de Inicio</option>
                            <option value="estado">Estado</option>
                        </select>
                        <input type="text" value={newData} onChange={(e) => setNewData(e.target.value)} />
                        <button onClick={handleUpdate}>Update</button>
                    </div>
                    <div>
                        <h3>Lista de Tareas:</h3>
                        <ul>
                            {proyecto.tareas.map((tarea) => (
                                <li key={tarea._id}>
                                    {editingTask === tarea._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editedTaskName}
                                                onChange={(e) => setEditedTaskName(e.target.value)}
                                            />
                                            <textarea
                                                value={editedTaskDescription}
                                                onChange={(e) => setEditedTaskDescription(e.target.value)}
                                            />
                                            <select
                                                value={editedTaskAssignee}
                                                onChange={(e) => setEditedTaskAssignee(e.target.value)}
                                            >
                                                <option value="">Seleccionar encargado</option>
                                                {colaboradoresList.map((colaborador) => (
                                                    <option key={colaborador._id} value={colaborador._id}>{colaborador.nombre}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={editedTaskState}
                                                onChange={(e) => setEditedTaskState(e.target.value)}
                                            >
                                                <option value="">Seleccionar estado</option>
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En Progreso">En Progreso</option>
                                                <option value="Terminada">Terminada</option>
                                            </select>
                                            <button onClick={() => handleEditTask(tarea._id)}>Guardar cambios</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>Nombre: {tarea.nombre}</p>
                                            <p>Descripción: {tarea.descripcion}</p>
                                            <p>Responsable: {tarea.responsable}</p>
                                            <button onClick={() => handleDeleteTask(tarea._id)}>Borrar tarea</button>
                                            <button onClick={() => setEditingTask(tarea._id)}>Modificar tarea</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div>
                <h3>Proyectos disponibles:</h3>
                <ul>
                    {proyectosList.map((proyecto) => (
                        <li key={proyecto._id}>{proyecto._id} - {proyecto.nombre}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ConsultarProAd;
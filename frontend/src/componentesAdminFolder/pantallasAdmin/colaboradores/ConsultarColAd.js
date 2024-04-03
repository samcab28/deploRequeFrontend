import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../adminStyle.css';

const ConsultarColAd = () => {
    const [searchId, setSearchId] = useState('');
    const [colaborador, setColaborador] = useState(null);
    const [colaboradoresList, setColaboradoresList] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [adminsList, setAdminsList] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [newData, setNewData] = useState('');

    const handleSearch = async () => {
        // Check if searchId is empty
        if (!searchId) {
            alert('Por favor, introduce un ID antes de realizar la búsqueda.');
            return; // Exit the function early
        }
        try {
            const response = await axios.get(`http://localhost:4000/api/colaborador/${searchId}`);
            setColaborador(response.data);
        } catch (error) {
            alert('Error: ese ID de Colaborador no existe');
            console.error('Error searching for collaborator:', error);
        }
    };

    const handleAdminSearch = async () => {
        // Check if searchId is empty
        if (!searchId) {
            alert('Por favor, introduce un ID antes de realizar la búsqueda.');
            return; // Exit the function early
        }
        try {
            const response = await axios.get(`http://localhost:4000/api/Admin/${searchId}`);
            setAdmin(response.data);
        } catch (error) {
            alert('Error: ese ID de Administrador no existe');
            console.error('Error searching for admin:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/colaborador/${colaborador._id}`);
            setColaborador(null);
            loadColaboradoresList();
        } catch (error) {
            console.error('Error deleting collaborator:', error);
        }
    };

    const handleAdminDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/Admin/${admin._id}`);
            setAdmin(null);
            loadAdminsList();
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/api/colaborador/${colaborador._id}`, { [selectedField]: newData });
            setColaborador(null);
            loadColaboradoresList();
        } catch (error) {
            console.error('Error updating collaborator:', error);
        }
    };

    const handleAdminUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/api/Admin/${admin._id}`, { [selectedField]: newData });
            setAdmin(null);
            loadAdminsList();
        } catch (error) {
            console.error('Error updating admin:', error);
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

    const loadAdminsList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/Admin');
            setAdminsList(response.data);
        } catch (error) {
            console.error('Error loading admins list:', error);
        }
    };

    useEffect(() => {
        if (searchId === '') {
            setColaborador(null);
            setAdmin(null);
        }
        loadColaboradoresList();
        loadAdminsList();
    }, [searchId]);

    return (
        <div className= 'simpleContainer'>
            <div className = 'smallContainer'>
            <input
                className = 'SearchBar'
                type="text"
                placeholder="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button className = 'Button' onClick={handleSearch}>Search</button>
            <button className = 'Button' onClick={handleAdminSearch}>Search Admin</button>
            </div>
            
            {colaborador && (
                <div>
                    <h3>Información del Colaborador:</h3>
                    <p>ID: {colaborador._id}</p>
                    <p>Nombre: {colaborador.nombre}</p>
                    <p>Cedula: {colaborador.cedula}</p>
                    <p>Correo: {colaborador.correo}</p>
                    <p>Password: {colaborador.password}</p>
                    <p>Departamento: {colaborador.departamento}</p>
                    <p>Telefono: {colaborador.telefono}</p>
                    <p>Estado: {colaborador.estado}</p>
                    <button className="buttonRojo" onClick={handleDelete}>Delete</button>
                    <div className = 'smallContainer'>
                        <select className = 'DropDownSimpleOffset' value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                            <option value="nombre">Nombre</option>
                            <option value="cedula">Cedula</option>
                            <option value="correo">Correo</option>
                            <option value="password">Password</option>
                            <option value="departamento">Departamento</option>
                            <option value="telefono">Telefono</option>
                            <option value="estado">Estado</option>
                        </select>
                        <input className = 'TextFieldWhite' type="text" value={newData} onChange={(e) => setNewData(e.target.value)} />
                        <button className = 'Button' onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            )}
            {admin && (
                <div>
                    <h3>Información del Admin:</h3>
                    <p>ID: {admin._id}</p>
                    <p>Nombre: {admin.nombre}</p>
                    <p>Cedula: {admin.cedula}</p>
                    <p>Correo: {admin.correo}</p>
                    <p>Password: {admin.password}</p>
                    <p>Departamento: {admin.departamento}</p>
                    <p>Telefono: {admin.telefono}</p>
                    <p>Estado: {admin.estado}</p>
                    <button className="buttonRojo" onClick={handleAdminDelete}>Delete</button>
                    <div className='smallContainer'>
                        <select className = 'DropDownSimpleOffset' value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                            <option value="nombre">Nombre</option>
                            <option value="cedula">Cedula</option>
                            <option value="correo">Correo</option>
                            <option value="password">Password</option>
                            <option value="departamento">Departamento</option>
                            <option value="telefono">Telefono</option>
                            <option value="estado">Estado</option>
                        </select>
                        <input className = 'TextFieldWhite' type="text" value={newData} onChange={(e) => setNewData(e.target.value)} />
                        <button className = 'Button' onClick={handleAdminUpdate}>Update</button>
                    </div>
                </div>
            )}
            {colaboradoresList.length > 0 && (
                <div>
                    <h3>Colaboradores:</h3>
                    <ul>
                        {colaboradoresList.map((colaborador) => (
                            <li key={colaborador._id}>{colaborador._id} - {colaborador.nombre}</li>
                        ))}
                    </ul>
                </div>
            )}
            {adminsList.length > 0 && (
                <div>
                    <h3>Admins:</h3>
                    <ul>
                        {adminsList.map((admin) => (
                            <li key={admin._id}>{admin._id} - {admin.nombre}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default ConsultarColAd;

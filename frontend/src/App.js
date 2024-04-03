// En App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminNav from './componentesAdminFolder/ComponentesAdmin';
import UsuarioNav from './componentesUsuarioFolder/ComponentesUsuario';
import HomeScreen from './HomeScreen/HomeScreen';
import './App.css';

const App = () => {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/admin" element={<AdminNav />} />
          <Route path="/usuario" element={<UsuarioNav />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
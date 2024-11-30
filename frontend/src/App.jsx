// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import DocumentEditor from './components/DocumentEditor';
import Register from './components/Register'; // Import the registration page
import CreateDocument from './components/CreateDocument';
import AllDocuments from './components/AllDocuments';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-document" element={<CreateDocument />} />
        <Route path="/documents" element={<AllDocuments />} />
        <Route path="/document/:id" element={<DocumentEditor />} />
      </Routes>
    </Router>
  );
};

export default App;

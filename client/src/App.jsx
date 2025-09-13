import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CollegePublicPage from './pages/CollegePublicPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CollegeList from './pages/CollegeList';
import CollegePage from './pages/CollegePage';
import AlumniList from './components/AlumniList';
import AlumniForm from './components/AlumniForm';
import AlumniDashboard from './pages/AlumniDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          borderBottom: '1px solid #dee2e6'
        }}>
          <a href="/" style={{ textDecoration: 'none', color: '#007bff' }}>Home</a>
          <a href="/colleges" style={{ textDecoration: 'none', color: '#007bff' }}>Colleges</a>
          <a href="/alumni" style={{ textDecoration: 'none', color: '#007bff' }}>Alumni</a>
          <a href="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</a>
          <a href="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Register</a>
        </nav>
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/college/:collegeId" element={<CollegePublicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/colleges" element={<CollegeList />} />
          <Route path="/colleges/:id" element={<CollegePage />} />
          <Route path="/alumni" element={<AlumniList />} />
          <Route path="/alumni/new" element={<AlumniForm onSubmit={() => {}} colleges={[]} />} />
          
          {/* Dashboard Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
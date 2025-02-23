import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { FamilyTreePage } from './pages/FamilyTreePage';
import { MemberPage } from './pages/MemberPage';
import { FamilyTreeProvider } from './contexts/FamilyTreeContext';
import { AuthProvider } from './contexts/AuthContext';

// Sample data moved to a central location
import { sampleFamilyData } from './data/sampleData';

function App() {
  return (
    <AuthProvider>
      <FamilyTreeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/family-tree" element={<FamilyTreePage />} />
            <Route path="/member/:id" element={<MemberPage data={sampleFamilyData} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </FamilyTreeProvider>
    </AuthProvider>
  );
}

export default App;
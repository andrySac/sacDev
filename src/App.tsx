import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MaterialProvider } from './contexts/MaterialContext';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { AddMaterial } from './pages/AddMaterial';
import { MaterialList } from './pages/MaterialList';
import { Dashboard } from './pages/Dashboard';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/add" replace /> : <Login />
          } 
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute>
              <MaterialList />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/add" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MaterialProvider>
          <AppRoutes />
        </MaterialProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
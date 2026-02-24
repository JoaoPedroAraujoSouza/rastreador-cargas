import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TransportadoraDashboard from './pages/TransportadoraDashboard';

// --- Componente Decisor de Dashboard ---
const MainDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-message">Carregando...</div>;

  // Lógica de Navegação baseada no Tipo de Usuário
  if (user?.userType === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (user?.userType === 'ADMIN') {
    return <TransportadoraDashboard />;
  }

  // Fallback (se for driver ou indefinido)
  return <div>Acesso restrito ou tipo de usuário desconhecido.</div>;
};

// --- Proteção de Rotas ---
const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();
  if (loading) return <div className="loading-message">Verificando sessão...</div>;
  return signed ? children : <Navigate to="/login" />;
};

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rota Raiz Inteligente */}
            <Route path="/" element={
              <PrivateRoute>
                <MainDashboard />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
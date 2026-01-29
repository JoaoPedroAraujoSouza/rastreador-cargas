import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Componentes
import Sidebar from './components/sidebar/Sidebar';
import Mapa from './components/Mapa';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterDriverModal from './components/RegisterDriverModal';

// Serviços
import WebSocketService from './services/WebSocketService';
import { getMotoristas, getLocalizacaoHistorico } from './services/api';
import { USE_MOCK, getMotoristaMock, getLocalizacaoHistoricoMock } from './services/mockData';

// --- Componente que Protege a Rota ---
const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) return <div className="loading-message">Carregando sessão...</div>;
  return signed ? children : <Navigate to="/login" />;
};

// --- Componente Dashboard (O antigo App.jsx entra aqui) ---
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [motoristas, setMotoristas] = useState([]);
  const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const subscriptionRef = useRef(null);

  // 1. Carrega Motoristas
  const fetchMotoristas = async () => {
    try {
      setLoading(true);
      // Se usar Mock, carrega mock. Se não, chama API
      const data = USE_MOCK ? await getMotoristaMock() : await getMotoristas();
      setMotoristas(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar motoristas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotoristas();

    // Conecta WS apenas se não for mock
    if (!USE_MOCK) {
      const token = localStorage.getItem('token');
      // Conecta e atualiza estado de conexão
      WebSocketService.connect(token, () => setIsWsConnected(true), (err) => console.error(err));
    }

    return () => { if(!USE_MOCK) WebSocketService.disconnect(); }
  }, []);

  // 2. Seleção e Histórico
  useEffect(() => {
    if (!motoristaSelecionado) return;

    const loadHistory = async () => {
      try {
        const apiFunc = USE_MOCK ? getLocalizacaoHistoricoMock : getLocalizacaoHistorico;
        const hist = await apiFunc(motoristaSelecionado.id);
        if (hist && hist.length > 0) {
          const loc = hist[0];
          setLocalizacao({
            latitude: loc.latitude,
            longitude: loc.longitude,
            dataHora: loc.timestamp || loc.dataHora
          });
        }
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    };
    loadHistory();

    // 3. WebSocket Subscription
    if (!USE_MOCK && isWsConnected) {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

      subscriptionRef.current = WebSocketService.subscribeToDriver(motoristaSelecionado.id, (data) => {
        setLocalizacao({
          latitude: data.latitude,
          longitude: data.longitude,
          dataHora: data.timestamp
        });
      });
    }

    return () => { if(subscriptionRef.current) subscriptionRef.current.unsubscribe(); }
  }, [motoristaSelecionado, isWsConnected]);

  return (
      <div className="app">
        <Sidebar
            motoristas={motoristas}
            onSelectMotorista={setMotoristaSelecionado}
            motoristaSelecionado={motoristaSelecionado}
        />

        {/* Botões Flutuantes de Admin (Topo do Mapa) */}
        <div style={{ position: 'absolute', top: 20, left: 340, zIndex: 1000, display: 'flex', gap: '10px' }}>
          <div style={{ background: 'var(--primary-dark)', padding: '10px 15px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-md)' }}>
            <strong>{user?.username}</strong>
            <span style={{fontSize: '0.8em', opacity: 0.8}}>({user?.role})</span>
          </div>

          {user?.role === 'ADMIN' && (
              <button onClick={() => setShowRegisterModal(true)} style={{ background: 'var(--success-green)', color: 'white', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                + Novo Motorista
              </button>
          )}

          <button onClick={logout} style={{ background: 'var(--error-red)', color: 'white', border: 'none', boxShadow: 'var(--shadow-md)' }}>
            Sair
          </button>
        </div>

        <div className="mapa-container">
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Carregando...</div>}

          {!USE_MOCK && !isWsConnected && !loading && (
              <div className="error-message" style={{ backgroundColor: 'orange' }}>
                WS Desconectado...
              </div>
          )}

          <Mapa
              latitude={localizacao?.latitude}
              longitude={localizacao?.longitude}
              nomeMotorista={motoristaSelecionado?.nome || motoristaSelecionado?.username || motoristaSelecionado?.fullName}
              dataHora={localizacao?.dataHora}
          />
        </div>

        {showRegisterModal && (
            <RegisterDriverModal
                onClose={() => setShowRegisterModal(false)}
                onSuccess={() => {
                  fetchMotoristas(); // Recarrega a lista após cadastro
                }}
            />
        )}
      </div>
  );
};

// --- Componente Principal com Rotas ---
function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rota Protegida: Só acessa se estiver logado */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
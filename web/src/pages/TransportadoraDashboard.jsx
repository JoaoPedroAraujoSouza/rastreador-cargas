import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar/Sidebar';
import Mapa from '../components/Mapa';
import RegisterDriverModal from '../components/RegisterDriverModal';
import WebSocketService from '../services/WebSocketService';
import { getUsers, getLocalizacaoHistorico } from '../services/api'; // Atualizado import
import { USE_MOCK, getMotoristaMock, getLocalizacaoHistoricoMock } from '../services/mockData';

const TransportadoraDashboard = () => {
    const { user, logout } = useAuth();

    // Estados de Dados
    const [motoristas, setMotoristas] = useState([]);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
    const [localizacao, setLocalizacao] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados de Controle
    const [isWsConnected, setIsWsConnected] = useState(false);
    const [showDriverModal, setShowDriverModal] = useState(false);

    const subscriptionRef = useRef(null);

    const fetchMotoristas = async () => {
        try {
            setLoading(true);
            // Busca geral de usuários, filtra no front apenas os DRIVERS desta transportadora
            // (Idealmente o backend 'listUsersByContext' já filtra, como fizemos no UserService)
            const data = USE_MOCK ? await getMotoristaMock() : await getUsers();
            setMotoristas(data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar frota.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMotoristas();
        if (!USE_MOCK) {
            const token = localStorage.getItem('token');
            WebSocketService.connect(token, () => setIsWsConnected(true), (err) => console.error("Erro WS:", err));
        }
        return () => { if(!USE_MOCK) WebSocketService.disconnect(); }
    }, []);

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
            } catch (e) { console.error(e); }
        };
        loadHistory();

        if (!USE_MOCK && isWsConnected) {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            subscriptionRef.current = WebSocketService.subscribeToDriver(motoristaSelecionado.id, (data) => {
                setLocalizacao({ latitude: data.latitude, longitude: data.longitude, dataHora: data.timestamp });
            });
        }
        return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
    }, [motoristaSelecionado, isWsConnected]);

    return (
        <div className="app">
            <Sidebar
                motoristas={motoristas}
                onSelectMotorista={setMotoristaSelecionado}
                motoristaSelecionado={motoristaSelecionado}
            />
            <div className="dashboard-header">
                <div className="user-badge">
                    <strong>{user?.username}</strong>
                    <span>TRANSPORTADORA</span>
                </div>
                <button className="btn-modern btn-green" onClick={() => setShowDriverModal(true)}>
                    <span>+ Novo Motorista</span>
                </button>
                <button className="btn-modern btn-red" onClick={logout}>Sair</button>
            </div>

            <div className="mapa-container">
                {loading && <div className="loading-message">Atualizando frota...</div>}
                <Mapa
                    latitude={localizacao?.latitude}
                    longitude={localizacao?.longitude}
                    nomeMotorista={motoristaSelecionado?.fullname || motoristaSelecionado?.username || "Selecione um motorista"}
                    dataHora={localizacao?.dataHora}
                />
            </div>

            {showDriverModal && (
                <RegisterDriverModal
                    onClose={() => setShowDriverModal(false)}
                    onSuccess={() => fetchMotoristas()}
                />
            )}
        </div>
    );
};

export default TransportadoraDashboard;
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar/Sidebar';
import Mapa from '../components/Mapa';
import RegisterDriverModal from '../components/RegisterDriverModal';
import WebSocketService from '../services/WebSocketService';
import { getUsers, getLocalizacaoHistorico } from '../services/api';
import { USE_MOCK, getMotoristaMock, getLocalizacaoHistoricoMock } from '../services/mockData';
import '../App.css'; // Garante que estilos globais sejam carregados

const TransportadoraDashboard = () => {
    const { user, logout } = useAuth();

    // Estados de Dados
    const [motoristas, setMotoristas] = useState([]);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
    const [localizacao, setLocalizacao] = useState(null);
    const [historicoRota, setHistoricoRota] = useState([]); // NOVO: Guarda a rota completa
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados de Controle
    const [isWsConnected, setIsWsConnected] = useState(false);
    const [showDriverModal, setShowDriverModal] = useState(false);

    const subscriptionRef = useRef(null);

    // 1. Carrega lista de motoristas
    const fetchMotoristas = async () => {
        try {
            setLoading(true);
            const data = USE_MOCK ? await getMotoristaMock() : await getUsers();
            // Se a API retornar todos, filtra apenas os drivers (se o backend já não filtrar)
            const driversOnly = data.filter(u => u.userType === 'DRIVER');
            setMotoristas(driversOnly.length > 0 ? driversOnly : data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar frota.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Conecta WebSocket
    useEffect(() => {
        fetchMotoristas();
        if (!USE_MOCK) {
            const token = localStorage.getItem('token');
            WebSocketService.connect(token, () => setIsWsConnected(true), (err) => console.error("Erro WS:", err));
        }
        return () => { if(!USE_MOCK) WebSocketService.disconnect(); }
    }, []);

    // 3. Carrega Histórico ao selecionar motorista
    useEffect(() => {
        if (!motoristaSelecionado) return;

        const loadHistory = async () => {
            try {
                const apiFunc = USE_MOCK ? getLocalizacaoHistoricoMock : getLocalizacaoHistorico;
                const hist = await apiFunc(motoristaSelecionado.id);

                if (hist && hist.length > 0) {
                    // O backend retorna DESC (Mais novo -> Mais antigo).
                    // Para o Replay, precisamos ASC (Antigo -> Novo).
                    const rotaCronologica = [...hist].reverse();
                    setHistoricoRota(rotaCronologica);

                    // Posição inicial = Última conhecida (fim da lista cronológica)
                    const ultima = rotaCronologica[rotaCronologica.length - 1];
                    setLocalizacao({
                        latitude: ultima.latitude,
                        longitude: ultima.longitude,
                        dataHora: ultima.timestamp || ultima.dataHora
                    });
                } else {
                    setHistoricoRota([]);
                }
            } catch (e) {
                console.error(e);
                setHistoricoRota([]);
            }
        };
        loadHistory();

        // Assina atualizações em tempo real
        if (!USE_MOCK && isWsConnected) {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            subscriptionRef.current = WebSocketService.subscribeToDriver(motoristaSelecionado.id, (data) => {
                // Atualiza posição atual
                setLocalizacao({ latitude: data.latitude, longitude: data.longitude, dataHora: data.timestamp });
                // Adiciona ao histórico em tempo real
                setHistoricoRota(prev => [...prev, { latitude: data.latitude, longitude: data.longitude, timestamp: data.timestamp }]);
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
                    // Passamos o histórico completo para o componente Mapa
                    historico={historicoRota}
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
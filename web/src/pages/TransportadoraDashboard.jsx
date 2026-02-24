import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar/Sidebar';
import Mapa from '../components/Mapa';
import RegisterDriverModal from '../components/RegisterDriverModal';
import WebSocketService from '../services/WebSocketService';
import { getUsers, getLocalizacaoHistorico } from '../services/api';
import { USE_MOCK, getMotoristaMock, getLocalizacaoHistoricoMock } from '../services/mockData';
import { FaPlus, FaSignOutAlt, FaUserTie } from 'react-icons/fa';
import '../App.css';

const TransportadoraDashboard = () => {
    const { user, logout } = useAuth();

    // Estados de Dados
    const [motoristas, setMotoristas] = useState([]);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
    const [localizacao, setLocalizacao] = useState(null);
    const [historicoRota, setHistoricoRota] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;
    const [isWsConnected, setIsWsConnected] = useState(false);
    const [showDriverModal, setShowDriverModal] = useState(false);

    const subscriptionRef = useRef(null);

    const fetchMotoristas = async (currentPage = 0) => {
        try {
            setLoading(true);

            let data;
            let content = [];
            let total = 0;

            if (USE_MOCK) {
                data = await getMotoristaMock();
                content = data;
                total = 1;
            } else {
                data = await getUsers(currentPage, PAGE_SIZE);
                content = data.content || [];
                total = data.totalPages;
            }

            setMotoristas(content);
            setTotalPages(total);
            setPage(currentPage);

        } catch (err) {
            console.error(err);
            setError('Erro ao carregar frota.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchMotoristas(newPage);
        }
    };

    useEffect(() => {
        fetchMotoristas(0); // Carrega página 0

        if (!USE_MOCK) {
            const token = localStorage.getItem('token');
            WebSocketService.connect(
                token,
                () => setIsWsConnected(true),
                (err) => console.error("Erro WS:", err)
            );
        }
        return () => { if(!USE_MOCK) WebSocketService.disconnect(); }
    }, []);

    // 3. Carrega Histórico e Assina WebSocket ao selecionar motorista
    useEffect(() => {
        if (!motoristaSelecionado) return;

        // A. Carrega Histórico (Replay)
        const loadHistory = async () => {
            try {
                const apiFunc = USE_MOCK ? getLocalizacaoHistoricoMock : getLocalizacaoHistorico;
                const hist = await apiFunc(motoristaSelecionado.id);

                if (hist && hist.length > 0) {
                    const rotaCronologica = [...hist].reverse();
                    setHistoricoRota(rotaCronologica);

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

        if (!USE_MOCK && isWsConnected) {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            subscriptionRef.current = WebSocketService.subscribeToDriver(motoristaSelecionado.id, (data) => {
                setLocalizacao({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    dataHora: data.timestamp
                });
                setHistoricoRota(prev => [...prev, {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timestamp: data.timestamp
                }]);
            });
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [motoristaSelecionado, isWsConnected]);

    return (
        <div className="app">
            <Sidebar
                motoristas={motoristas}
                onSelectMotorista={setMotoristaSelecionado}
                motoristaSelecionado={motoristaSelecionado}
                // Props de Paginação
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <div className="dashboard-header">
                <div className="user-badge">
                    <div className="avatar-circle">
                        <FaUserTie />
                    </div>
                    <div className="user-info">
                        <strong>{user?.username}</strong>
                        <span>TRANSPORTADORA</span>
                    </div>
                </div>

                <button className="btn-modern btn-green" onClick={() => setShowDriverModal(true)}>
                    <FaPlus className="btn-icon" /> <span>Novo Motorista</span>
                </button>
                <button className="btn-modern btn-red" onClick={logout}>
                    <FaSignOutAlt className="btn-icon" /> <span>Sair</span>
                </button>
            </div>

            <div className="mapa-container">
                {loading && <div className="loading-message">Atualizando frota...</div>}
                <Mapa
                    latitude={localizacao?.latitude}
                    longitude={localizacao?.longitude}
                    historico={historicoRota}
                    nomeMotorista={motoristaSelecionado?.fullname || motoristaSelecionado?.username || "Selecione um motorista"}
                    dataHora={localizacao?.dataHora}
                />
            </div>

            {showDriverModal && (
                <RegisterDriverModal
                    onClose={() => setShowDriverModal(false)}
                    onSuccess={() => fetchMotoristas(page)}
                />
            )}
        </div>
    );
};

export default TransportadoraDashboard;
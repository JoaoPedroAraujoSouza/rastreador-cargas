import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api';
import RegisterCompanyModal from '../components/RegisterCompanyModal';
import { FaBuilding, FaPlus, FaUsers, FaSearch, FaSignOutAlt, FaNetworkWired } from 'react-icons/fa';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const { user, logout } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [busca, setBusca] = useState('');

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const allUsers = await getUsers();
            // Filtra apenas ADMIN (Transportadoras)
            // No futuro, isso pode ser um endpoint específico do backend
            const admins = allUsers.filter(u => u.userType === 'ADMIN');
            setCompanies(admins);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Filtro local por nome ou documento
    const filteredCompanies = companies.filter(c =>
        (c.fullname && c.fullname.toLowerCase().includes(busca.toLowerCase())) ||
        (c.document && c.document.includes(busca))
    );

    return (
        <div className="super-dashboard">
            {/* Header Fixo */}
            <header className="super-header">
                <div className="header-brand">
                    <h1>Rastreador Pro <span className="badge-super">Super Admin</span></h1>
                </div>
                <div className="header-profile">
                    <span className="admin-name">Olá, {user?.username}</span>
                    <button className="btn-logout-ghost" onClick={logout}>
                        <FaSignOutAlt style={{marginRight: '8px'}}/> Sair
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                {/* Cards de Métricas */}
                <div className="stats-container">
                    <div className="stat-card purple">
                        <div className="icon-box"><FaBuilding /></div>
                        <div className="stat-details">
                            <h3>Transportadoras Ativas</h3>
                            <span className="value">{companies.length}</span>
                        </div>
                    </div>
                    <div className="stat-card blue">
                        <div className="icon-box"><FaNetworkWired /></div>
                        <div className="stat-details">
                            <h3>Sistema Online</h3>
                            <span className="value" style={{color: '#27ae60', fontSize: '1.2rem'}}>Operacional</span>
                        </div>
                    </div>
                </div>

                {/* Barra de Ações */}
                <div className="actions-row">
                    <div className="search-input-wrapper">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Pesquisar transportadora ou CNPJ..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                    <button className="btn-new-company" onClick={() => setShowModal(true)}>
                        <FaPlus /> Nova Transportadora
                    </button>
                </div>

                {/* Tabela de Dados */}
                <div className="table-container">
                    {loading ? (
                        <div className="empty-state">Carregando dados do sistema...</div>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Empresa / Razão Social</th>
                                <th>Usuário Mestre</th>
                                <th>CNPJ</th>
                                <th>Email Corporativo</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map(company => (
                                    <tr key={company.id}>
                                        <td className="company-name-cell">{company.fullname}</td>
                                        <td>{company.username}</td>
                                        <td>{company.document}</td>
                                        <td>{company.email}</td>
                                        <td>
                                            <span className="badge-status active">Ativo</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        {busca ? "Nenhuma empresa encontrada com este termo." : "Nenhuma transportadora cadastrada."}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Modal de Cadastro */}
            {showModal && (
                <RegisterCompanyModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchCompanies}
                />
            )}
        </div>
    );
};

export default SuperAdminDashboard;
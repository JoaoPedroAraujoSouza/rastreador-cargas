import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser } from '../services/api';
import RegisterCompanyModal from '../components/RegisterCompanyModal';
import EditCompanyModal from '../components/EditCompanyModal';
import ViewDriversModal from '../components/ViewDriversModal'; // <--- NOVO IMPORT
import { FaBuilding, FaPlus, FaSearch, FaSignOutAlt, FaNetworkWired, FaTrash, FaEdit, FaEye } from 'react-icons/fa'; // <--- FaEye
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const { user, logout } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados dos Modais
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [viewingCompany, setViewingCompany] = useState(null); // <--- ESTADO PARA VISUALIZAR FROTA

    const [busca, setBusca] = useState('');

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setCompanies(data);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`ATENÇÃO: Deseja excluir a transportadora "${name}"?`)) {
            try {
                await deleteUser(id);
                setCompanies(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro ao excluir. Verifique dependências.");
            }
        }
    };

    const handleEditClick = (company) => {
        setEditingCompany(company);
    };

    // --- ABRIR MODAL DE FROTA ---
    const handleViewFleet = (company) => {
        setViewingCompany(company);
    };

    const filteredCompanies = companies.filter(c =>
        (c.fullname && c.fullname.toLowerCase().includes(busca.toLowerCase())) ||
        (c.document && c.document.includes(busca))
    );

    return (
        <div className="super-dashboard">
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

                <div className="actions-row">
                    <div className="search-input-wrapper">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Pesquisar transportadora..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                    <button className="btn-new-company" onClick={() => setShowRegisterModal(true)}>
                        <FaPlus /> Nova Transportadora
                    </button>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="empty-state">Carregando...</div>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Usuário</th>
                                <th>CNPJ</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th style={{textAlign: 'center'}}>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map(company => (
                                    <tr key={company.id}>
                                        <td className="company-name-cell">{company.fullname || "Sem Nome"}</td>
                                        <td>{company.username}</td>
                                        <td>{company.document}</td>
                                        <td>{company.email}</td>
                                        <td><span className="badge-status active">Ativo</span></td>
                                        <td style={{textAlign: 'center'}}>

                                            {/* BOTÃO VER FROTA (NOVO) */}
                                            <button
                                                className="btn-action view"
                                                title="Ver Frota de Motoristas"
                                                onClick={() => handleViewFleet(company)}
                                            >
                                                <FaEye />
                                            </button>

                                            <button
                                                className="btn-action edit"
                                                title="Editar Transportadora"
                                                onClick={() => handleEditClick(company)}
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                className="btn-action delete"
                                                title="Excluir"
                                                onClick={() => handleDelete(company.id, company.fullname)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="empty-state">Nenhum resultado.</td></tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {showRegisterModal && (
                <RegisterCompanyModal
                    onClose={() => setShowRegisterModal(false)}
                    onSuccess={fetchCompanies}
                />
            )}

            {editingCompany && (
                <EditCompanyModal
                    company={editingCompany}
                    onClose={() => setEditingCompany(null)}
                    onSuccess={fetchCompanies}
                />
            )}

            {/* Modal de Visualização de Frota */}
            {viewingCompany && (
                <ViewDriversModal
                    company={viewingCompany}
                    onClose={() => setViewingCompany(null)}
                />
            )}
        </div>
    );
};

export default SuperAdminDashboard;
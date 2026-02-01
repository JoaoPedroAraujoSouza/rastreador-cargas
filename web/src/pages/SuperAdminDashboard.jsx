import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser } from '../services/api';
import RegisterCompanyModal from '../components/RegisterCompanyModal';
import EditCompanyModal from '../components/EditCompanyModal';
import ViewDriversModal from '../components/ViewDriversModal';
import { FaBuilding, FaPlus, FaSearch, FaSignOutAlt, FaNetworkWired, FaTrash, FaEdit, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const { user, logout } = useAuth();

    // Dados e Estado da Tabela
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Paginação
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const PAGE_SIZE = 10;

    // Modais
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [viewingCompany, setViewingCompany] = useState(null);

    const [busca, setBusca] = useState('');

    const fetchCompanies = async (currentPage = 0) => {
        try {
            setLoading(true);
            // Chama a API passando a página atual
            const data = await getUsers(currentPage, PAGE_SIZE);

            // O Backend agora retorna um objeto Page, a lista real está em 'content'
            setCompanies(data.content || []);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    // Recarrega sempre que a página muda
    useEffect(() => {
        fetchCompanies(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`ATENÇÃO: Deseja excluir a transportadora "${name}"?`)) {
            try {
                await deleteUser(id);
                // Atualiza a lista mantendo a página atual
                fetchCompanies(page);
                alert("Transportadora removida com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro ao excluir. Verifique dependências.");
            }
        }
    };

    // Filtro local (Atenção: filtra apenas a PÁGINA ATUAL visualizada)
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
                            <h3>Transportadoras</h3>
                            {/* Mostra o total real do banco, não apenas da página */}
                            <span className="value">{totalElements}</span>
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
                            placeholder="Filtrar nesta página..."
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
                        <div className="empty-state">Carregando dados...</div>
                    ) : (
                        <>
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
                                                <button className="btn-action view" title="Ver Frota" onClick={() => setViewingCompany(company)}>
                                                    <FaEye />
                                                </button>
                                                <button className="btn-action edit" title="Editar" onClick={() => setEditingCompany(company)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="btn-action delete" title="Excluir" onClick={() => handleDelete(company.id, company.fullname)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="empty-state">Nenhum resultado encontrado nesta página.</td></tr>
                                )}
                                </tbody>
                            </table>

                            {/* --- CONTROLES DE PAGINAÇÃO --- */}
                            <div className="pagination-footer">
                                <span className="pagination-info">
                                    Página <strong>{page + 1}</strong> de <strong>{totalPages || 1}</strong>
                                </span>
                                <div className="pagination-actions">
                                    <button
                                        className="btn-page"
                                        disabled={page === 0}
                                        onClick={() => handlePageChange(page - 1)}
                                    >
                                        <FaChevronLeft /> Anterior
                                    </button>
                                    <button
                                        className="btn-page"
                                        disabled={page >= totalPages - 1}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        Próximo <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Modais (Mantidos iguais) */}
            {showRegisterModal && <RegisterCompanyModal onClose={() => setShowRegisterModal(false)} onSuccess={() => fetchCompanies(page)} />}
            {editingCompany && <EditCompanyModal company={editingCompany} onClose={() => setEditingCompany(null)} onSuccess={() => fetchCompanies(page)} />}
            {viewingCompany && <ViewDriversModal company={viewingCompany} onClose={() => setViewingCompany(null)} />}
        </div>
    );
};

export default SuperAdminDashboard;
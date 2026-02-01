import { useState } from 'react';
import { FaSearch, FaTruck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({
                     motoristas = [],
                     onSelectMotorista,
                     motoristaSelecionado,
                     page = 0,
                     totalPages = 1,
                     onPageChange
                 }) => {
    const [busca, setBusca] = useState('');

    const normalizarTexto = (texto) => {
        if (!texto) return '';
        return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const termoBusca = normalizarTexto(busca);

    const motoristasFiltrados = motoristas.filter((motorista) => {
        const nomeReal = normalizarTexto(
            motorista.fullname || motorista.fullName || motorista.nome || motorista.username
        );
        const usuario = normalizarTexto(motorista.username);
        const documento = normalizarTexto(motorista.document || motorista.cpf);

        if (!termoBusca) return true;

        return nomeReal.includes(termoBusca) ||
            usuario.includes(termoBusca) ||
            documento.includes(termoBusca);
    });

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Minha Frota <span className="badge-count">{motoristas.length}</span></h2>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar nesta página..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
            </div>

            <div className="motoristas-lista">
                {motoristasFiltrados.length === 0 ? (
                    <div className="sem-resultados">
                        <p>{busca ? `Sem resultados para "${busca}"` : "Nenhum motorista nesta página."}</p>
                    </div>
                ) : (
                    motoristasFiltrados.map((motorista) => {
                        const nomeExibicao = motorista.fullname || motorista.fullName || motorista.nome || motorista.username || "Sem Nome";
                        const subTitulo = motorista.username ? `@${motorista.username}` : (motorista.document || "S/ Doc");

                        return (
                            <div
                                key={motorista.id}
                                className={`motorista-item ${motoristaSelecionado?.id === motorista.id ? 'ativo' : ''}`}
                                onClick={() => onSelectMotorista(motorista)}
                            >
                                <div className="motorista-avatar"><FaTruck /></div>
                                <div className="motorista-info">
                                    <div className="motorista-nome">{nomeExibicao}</div>
                                    <div className="motorista-sub">{subTitulo}</div>
                                </div>
                                <div className="status-indicator online"></div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* REMOVIDA A CONDIÇÃO {totalPages > 1 && ...} PARA APARECER SEMPRE */}
            <div className="sidebar-footer">
                <button
                    className="pagination-btn"
                    disabled={page === 0}
                    onClick={() => onPageChange && onPageChange(page - 1)}
                    title="Página Anterior"
                >
                    <FaChevronLeft />
                </button>

                <span className="pagination-info">
                    {page + 1} / {totalPages || 1}
                </span>

                <button
                    className="pagination-btn"
                    disabled={page >= (totalPages - 1)}
                    onClick={() => onPageChange && onPageChange(page + 1)}
                    title="Próxima Página"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
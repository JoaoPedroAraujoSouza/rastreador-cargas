import { useState, useEffect } from 'react';
import { FaSearch, FaTruck } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ motoristas = [], onSelectMotorista, motoristaSelecionado }) => {
    const [busca, setBusca] = useState('');

    // --- DEBUG: Mostra no console o formato real do primeiro motorista ---
    useEffect(() => {
        if (motoristas.length > 0) {
            console.log("ESTRUTURA DO MOTORISTA (Verifique as chaves):", motoristas[0]);
        }
    }, [motoristas]);
    // -------------------------------------------------------------------

    const normalizarTexto = (texto) => {
        if (!texto) return '';
        return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const termoBusca = normalizarTexto(busca);

    const motoristasFiltrados = motoristas.filter((motorista) => {
        // Tenta ler o nome de várias propriedades possíveis
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
                <h2>Minha Frota <span className="badge-count">{motoristasFiltrados.length}</span></h2>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
            </div>

            <div className="motoristas-lista">
                {motoristasFiltrados.length === 0 ? (
                    <div className="sem-resultados">
                        <p>{busca ? `Sem resultados para "${busca}"` : "Nenhum motorista na lista."}</p>
                    </div>
                ) : (
                    motoristasFiltrados.map((motorista) => {
                        // Lógica de exibição robusta
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
        </div>
    );
};

export default Sidebar;
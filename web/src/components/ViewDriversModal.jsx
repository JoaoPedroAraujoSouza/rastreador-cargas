import { useState, useEffect } from 'react';
import { getDriversByManager } from '../services/api';
import { FaTimes, FaUserTie, FaIdCard, FaEnvelope } from 'react-icons/fa';
import './EditCompanyModal.css'; // Podemos reutilizar o CSS do modal de edição

const ViewDriversModal = ({ company, onClose }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDrivers = async () => {
            try {
                const data = await getDriversByManager(company.id);
                setDrivers(data);
            } catch (error) {
                console.error(error);
                alert("Erro ao carregar a frota da transportadora.");
            } finally {
                setLoading(false);
            }
        };
        if (company) loadDrivers();
    }, [company]);

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '600px'}}>
                <div className="modal-header">
                    <h2>Frota: {company.fullname}</h2>
                    <button className="btn-close" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '20px', color: '#7f8c8d'}}>Carregando lista de motoristas...</div>
                    ) : drivers.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '30px', color: '#7f8c8d', background: '#f8f9fa', borderRadius: '8px'}}>
                            <p>Nenhum motorista vinculado a esta transportadora.</p>
                        </div>
                    ) : (
                        <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                                {drivers.map(driver => (
                                    <li key={driver.id} style={{
                                        padding: '15px',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        transition: 'background 0.2s'
                                    }}>
                                        <div style={{
                                            background: '#e0f7fa',
                                            color: '#006064',
                                            width: '45px', height: '45px',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            <FaUserTie />
                                        </div>
                                        <div style={{flex: 1}}>
                                            <strong style={{display: 'block', fontSize: '1rem', color: '#2c3e50'}}>
                                                {driver.fullname || driver.username}
                                            </strong>
                                            <div style={{display: 'flex', gap: '15px', marginTop: '4px'}}>
                                                <span style={{fontSize: '0.85rem', color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                    <FaIdCard /> {driver.document || 'CPF N/D'}
                                                </span>
                                                <span style={{fontSize: '0.85rem', color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                    <FaEnvelope /> {driver.email || 'Email N/D'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="badge-status active" style={{fontSize: '0.75rem', padding: '4px 10px'}}>Ativo</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                    <div style={{fontSize: '0.8rem', color: '#95a5a6', flex: 1}}>
                        Total de Motoristas: <strong>{drivers.length}</strong>
                    </div>
                    <button type="button" className="btn-cancel" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default ViewDriversModal;
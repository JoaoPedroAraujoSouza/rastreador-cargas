import { useState, useEffect } from 'react';
import { updateUser } from '../services/api';
import { FaTimes, FaSave, FaBuilding, FaUser, FaLock } from 'react-icons/fa';
import './EditCompanyModal.css'; // Vamos criar o CSS abaixo

const EditCompanyModal = ({ company, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '' // Opcional
    });
    const [loading, setLoading] = useState(false);

    // Carrega os dados atuais ao abrir o modal
    useEffect(() => {
        if (company) {
            setFormData({
                fullname: company.fullname || '',
                username: company.username || '',
                password: '' // Senha começa vazia (só envia se quiser trocar)
            });
        }
    }, [company]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Monta o payload (só envia o que o backend aceita)
            const payload = {
                fullname: formData.fullname,
                username: formData.username,
                // Só envia senha se o usuário digitou algo
                ...(formData.password && { password: formData.password })
            };

            await updateUser(company.id, payload);
            alert('Transportadora atualizada com sucesso!');
            onSuccess(); // Recarrega a lista
            onClose();   // Fecha modal
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Editar Transportadora</h2>
                    <button className="btn-close" onClick={onClose}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FaBuilding /> Razão Social / Nome</label>
                        <input
                            type="text"
                            value={formData.fullname}
                            onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaUser /> Usuário Mestre (Login)</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaLock /> Nova Senha (Opcional)</label>
                        <input
                            type="password"
                            placeholder="Deixe em branco para manter a atual"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* Nota sobre limitações do Backend atual */}
                    <div className="info-text">
                        <small>* Para alterar CNPJ ou Email, contate o suporte de banco de dados.</small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : <><FaSave /> Salvar Alterações</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyModal;    
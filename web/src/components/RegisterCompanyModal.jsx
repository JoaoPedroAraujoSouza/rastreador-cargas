import { useState } from 'react';
import api from '../services/api';
import './RegisterDriverModal.css'; // Podemos reaproveitar o CSS

const RegisterCompanyModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '', // Nome da Empresa
        email: '',
        document: '', // CNPJ
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // O 'userType' aqui é ADMIN (que significa Dono de Transportadora)
            await api.post('/auth/register', {
                ...formData,
                userType: 'ADMIN'
            });
            alert('Transportadora cadastrada com sucesso!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Erro ao criar empresa. Verifique se Usuário/Email/CNPJ já existem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h3>Nova Transportadora</h3>
                <p className="step-desc">Cadastro de novo cliente (Empresa)</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome Fantasia (Empresa)</label>
                        <input
                            value={formData.fullname}
                            onChange={e => setFormData({...formData, fullname: e.target.value})}
                            placeholder="Logística Exemplo Ltda" required
                        />
                    </div>
                    <div className="form-group">
                        <label>Usuário de Login</label>
                        <input
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            placeholder="log_exemplo" required
                        />
                    </div>
                    <div className="form-group">
                        <label>CNPJ</label>
                        <input
                            value={formData.document}
                            onChange={e => setFormData({...formData, document: e.target.value})}
                            placeholder="00.000.000/0001-00" required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Corporativo</label>
                        <input
                            type="email" value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha Inicial</label>
                        <input
                            type="password" value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterCompanyModal;
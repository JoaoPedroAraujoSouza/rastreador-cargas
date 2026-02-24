import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaTruckLoading } from 'react-icons/fa';
import './Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        document: '', // CPF/CNPJ
        password: '',
        confirmPass: ''
    });

    const { registerAdmin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPass) {
            setError("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        try {
            await registerAdmin({
                username: formData.username,
                email: formData.email,
                document: formData.document,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Erro no cadastro. Email ou Documento já podem estar em uso.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Seção Esquerda: Form */}
            <div className="auth-form-section">
                <div className="auth-card" style={{ maxWidth: '500px' }}> {/* Um pouco mais largo */}
                    <div className="auth-header">
                        <h2>Nova Transportadora</h2>
                        <p>Cadastre sua empresa para começar a gerenciar.</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Grid para inputs ficarem lado a lado se houver espaço (opcional, aqui vou deixar empilhado para mobile first) */}

                        <div className="form-group">
                            <label>Nome da Empresa (Usuário)</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Ex: Logística Express"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Corporativo</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contato@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>CNPJ ou CPF</label>
                            <div className="input-wrapper">
                                <FaIdCard className="input-icon" />
                                <input
                                    name="document"
                                    value={formData.document}
                                    onChange={handleChange}
                                    placeholder="Apenas números"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Senha</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Confirmar</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        name="confirmPass"
                                        value={formData.confirmPass}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                color: '#ff6b6b',
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                padding: '10px',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                marginBottom: '1rem',
                                border: '1px solid rgba(255, 107, 107, 0.2)'
                            }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Criando conta...' : 'Registrar Empresa'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Já possui uma conta?
                        <span className="auth-link" onClick={() => navigate('/login')}>Fazer Login</span>
                    </div>
                </div>
            </div>

            {/* Seção Direita: Brand */}
            <div className="auth-brand-section">
                <div className="brand-bg-pattern"></div>
                <div className="brand-content">
                    <FaTruckLoading className="brand-icon-large" />
                    <h1>Expanda suas Operações</h1>
                    <p>
                        Junte-se a milhares de transportadoras que utilizam nossa plataforma
                        para reduzir custos e aumentar a eficiência logística.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
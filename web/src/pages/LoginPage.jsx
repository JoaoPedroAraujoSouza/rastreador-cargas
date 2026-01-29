import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaTruckMoving, FaMapMarkedAlt, FaWhatsapp } from 'react-icons/fa';
import './Auth.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Acesso negado. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestAccess = () => {
        window.open('https://wa.me/5581992281988?text=Olá, tenho interesse na plataforma de rastreamento.', '_blank');
    };

    return (
        <div className="auth-page">
            <div className="auth-form-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <FaTruckMoving /> <span>FleetTrack</span>
                        </div>
                        <h2>Acesso Restrito</h2>
                        <p>Plataforma exclusiva para transportadoras parceiras.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Usuário Corporativo</label>
                            <div className="input-wrapper">
                                {/* O ícone só aparece se o campo estiver vazio */}
                                <FaUser
                                    className="input-icon"
                                    style={{ display: username ? 'none' : 'block' }}
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    // Placeholder descritivo e moderno
                                    placeholder={username ? "" : "Ex: transportadora_exemplo"}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <div className="input-wrapper">
                                {/* O ícone só aparece se o campo estiver vazio */}
                                <FaLock
                                    className="input-icon"
                                    style={{ display: password ? 'none' : 'block' }}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={password ? "" : "Sua senha de acesso"}
                                    required
                                />
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
                            {isLoading ? 'Autenticando...' : 'Acessar Painel'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Ainda não é parceiro?
                        <div
                            className="auth-link"
                            onClick={handleRequestAccess}
                            style={{display: 'inline-flex', alignItems: 'center', gap: '5px', verticalAlign: 'middle', cursor: 'pointer'}}
                        >
                            <FaWhatsapp /> Solicitar Demonstração
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-brand-section">
                <div className="brand-bg-pattern"></div>
                <div className="brand-content">
                    <FaMapMarkedAlt className="brand-icon-large" />
                    <h1>Gestão de Frotas de Elite</h1>
                    <p>
                        Segurança total e controle em tempo real. <br/>
                        O acesso a esta plataforma é restrito a administradores autorizados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
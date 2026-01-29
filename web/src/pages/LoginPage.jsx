import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaTruckMoving, FaMapMarkedAlt } from 'react-icons/fa'; // Ícones
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
            setError('Credenciais inválidas. Verifique seu usuário e senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Seção Esquerda: Formulário */}
            <div className="auth-form-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <FaTruckMoving /> <span>FleetTrack</span>
                        </div>
                        <h2>Bem-vindo de volta</h2>
                        <p>Insira suas credenciais para acessar o painel.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Usuário</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Seu nome de usuário"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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
                            {isLoading ? 'Entrando...' : 'Acessar Plataforma'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Não tem uma conta corporativa?
                        <span className="auth-link" onClick={() => navigate('/register')}>Criar cadastro</span>
                    </div>
                </div>
            </div>

            {/* Seção Direita: Branding */}
            <div className="auth-brand-section">
                <div className="brand-bg-pattern"></div>
                <div className="brand-content">
                    <FaMapMarkedAlt className="brand-icon-large" />
                    <h1>Rastreamento Inteligente em Tempo Real</h1>
                    <p>
                        Monitore sua frota, otimize rotas e garanta a segurança da sua carga
                        com nossa tecnologia de ponta.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
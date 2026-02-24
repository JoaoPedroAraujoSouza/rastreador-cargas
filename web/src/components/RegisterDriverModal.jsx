import { useState } from 'react';
import { register, createVehicle } from '../services/api';
import api from '../services/api';
import './RegisterDriverModal.css';

const RegisterDriverModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [createdDriverId, setCreatedDriverId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Estado para Dados do Motorista
    const [driverData, setDriverData] = useState({
        username: '',
        fullname: '', // Agora será preenchido pelo input
        email: '',
        document: '',
        password: '',
        userType: 'DRIVER'
    });

    // Estado para Dados do Veículo
    const [vehicleData, setVehicleData] = useState({
        name: '',
        licensePlate: ''
    });

    const handleCreateDriver = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Cria o Motorista
            await register(driverData);

            // 2. Recupera o ID (Busca pelo username único)
            const usersResponse = await api.get('/users');
            const newUser = usersResponse.data.find(u => u.username === driverData.username);

            if (newUser) {
                setCreatedDriverId(newUser.id);
                setStep(2); // Vai para a tela do veículo
            } else {
                // Fallback: se não achar na lista, tenta logar ou avisa
                setError('Motorista criado, mas não foi possível vincular o veículo automaticamente. Tente novamente.');
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao criar motorista. Verifique se o usuário, email ou CPF já existem.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVehicle = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createVehicle({
                name: vehicleData.name,
                licensePlate: vehicleData.licensePlate,
                ownerId: createdDriverId
            });

            alert('Motorista e Veículo cadastrados com sucesso!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Erro ao cadastrar veículo. Verifique a placa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>

                {step === 1 ? (
                    <form onSubmit={handleCreateDriver}>
                        <h3>Novo Motorista (1/2)</h3>
                        <p className="step-desc">Dados Pessoais e Acesso</p>

                        {/* CAMPO NOVO: NOME COMPLETO */}
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                value={driverData.fullname}
                                onChange={e => setDriverData({...driverData, fullname: e.target.value})}
                                placeholder="Ex: João da Silva"
                                required
                            />
                        </div>

                        {/* CAMPO SEPARADO: USUÁRIO */}
                        <div className="form-group">
                            <label>Usuário de Acesso (Login)</label>
                            <input
                                value={driverData.username}
                                onChange={e => setDriverData({...driverData, username: e.target.value})}
                                placeholder="Ex: motorista_joao"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={driverData.email}
                                onChange={e => setDriverData({...driverData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>CPF (Apenas números)</label>
                            <input
                                value={driverData.document}
                                onChange={e => setDriverData({...driverData, document: e.target.value})}
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha Provisória</label>
                            <input
                                type="password"
                                value={driverData.password}
                                onChange={e => setDriverData({...driverData, password: e.target.value})}
                                required
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Processando...' : 'Próximo: Cadastrar Veículo'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateVehicle}>
                        <h3>Veículo (2/2)</h3>
                        <p className="step-desc">Vinculado a: <strong>{driverData.fullname}</strong></p>

                        <div className="form-group">
                            <label>Modelo do Caminhão</label>
                            <input
                                value={vehicleData.name}
                                onChange={e => setVehicleData({...vehicleData, name: e.target.value})}
                                placeholder="Ex: Scania R450"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Placa</label>
                            <input
                                value={vehicleData.licensePlate}
                                onChange={e => setVehicleData({...vehicleData, licensePlate: e.target.value.toUpperCase()})}
                                placeholder="ABC-1234"
                                maxLength={8}
                                required
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Salvando...' : 'Finalizar Cadastro'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterDriverModal;
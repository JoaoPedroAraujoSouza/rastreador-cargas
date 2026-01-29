import { useState } from 'react';
import { register, createVehicle } from '../services/api';
import api from '../services/api';
import './RegisterDriverModal.css';

const RegisterDriverModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [createdDriverId, setCreatedDriverId] = useState(null);

    // Estado para Dados do Motorista (User Entity)
    const [driverData, setDriverData] = useState({
        username: '',
        email: '',
        document: '',
        password: '',
        userType: 'DRIVER'
    });

    // Estado para Dados do Veículo (Vehicle Entity)
    const [vehicleData, setVehicleData] = useState({
        name: '',
        licensePlate: ''
    });

    const handleCreateDriver = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Cria o Motorista (User)
            await register(driverData);

            // 2. Recupera o ID do motorista recém criado
            // (Isso é necessário se o endpoint register não retornar o ID diretamente)
            const usersResponse = await api.get('/users');
            const newUser = usersResponse.data.find(u => u.username === driverData.username);

            if (newUser) {
                setCreatedDriverId(newUser.id);
                setStep(2); // Avança para cadastro do veículo
            } else {
                setError('Motorista criado, mas houve erro ao recuperar o ID.');
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao criar motorista. Email ou Documento já podem estar em uso.');
        }
    };

    const handleCreateVehicle = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 3. Cria o Veículo vinculado ao Motorista
            await createVehicle({
                name: vehicleData.name,
                licensePlate: vehicleData.licensePlate,
                ownerId: createdDriverId
            });

            alert('Motorista e Veículo cadastrados com sucesso!');
            onSuccess(); // Atualiza a lista no Dashboard
            onClose();   // Fecha a modal
        } catch (err) {
            console.error(err);
            setError('Erro ao cadastrar veículo. A placa já pode estar cadastrada.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>

                {step === 1 ? (
                    <form onSubmit={handleCreateDriver}>
                        <h3>Novo Motorista (1/2)</h3>
                        <p className="step-desc">Dados de Acesso</p>

                        <div className="form-group">
                            <label>Nome Completo / Usuário</label>
                            <input
                                value={driverData.username}
                                onChange={e => setDriverData({...driverData, username: e.target.value})}
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
                            <label>CPF (Documento)</label>
                            <input
                                value={driverData.document}
                                onChange={e => setDriverData({...driverData, document: e.target.value})}
                                placeholder="Apenas números"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha de Acesso</label>
                            <input
                                type="password"
                                value={driverData.password}
                                onChange={e => setDriverData({...driverData, password: e.target.value})}
                                required
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn-primary">Próximo: Cadastrar Veículo</button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateVehicle}>
                        <h3>Dados do Veículo (2/2)</h3>
                        <p className="step-desc">Motorista: <strong>{driverData.username}</strong></p>

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
                        <button type="submit" className="btn-primary">Finalizar Cadastro</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterDriverModal;
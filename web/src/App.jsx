import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Mapa from './components/Mapa';
import { getMotoristas, getLocalizacaoHistorico } from './services/api';

const MOTORISTAS_MOCK = [
  { id: 1, nome: "João Silva", tipo: "MOTORISTA" },
  { id: 2, nome: "Maria Santos", tipo: "MOTORISTA" },
  { id: 3, nome: "Pedro Oliveira", tipo: "MOTORISTA" }
];

const LOCALIZACOES_MOCK = {
  1: [{ latitude: -23.5505, longitude: -46.6333, dataHora: "2026-01-14T10:30:00" }],
  2: [{ latitude: -22.9068, longitude: -43.1729, dataHora: "2026-01-14T11:15:00" }],
  3: [{ latitude: -19.9167, longitude: -43.9345, dataHora: "2026-01-14T09:45:00" }]
};

const USE_MOCK = true;

function App() {
  const [motoristas, setMotoristas] = useState([]);
  const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        setLoading(true);
        
        if (USE_MOCK) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setMotoristas(MOTORISTAS_MOCK);
          setError(null);
        } else {
          const data = await getMotoristas();
          setMotoristas(data);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao buscar motoristas:', err);
        setError('Erro ao carregar motoristas. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };

    fetchMotoristas();
  }, []);

  const handleSelectMotorista = async (motorista) => {
    setMotoristaSelecionado(motorista);
    
    try {
      setLoading(true);
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const historicoLocalizacoes = LOCALIZACOES_MOCK[motorista.id];
        
        if (historicoLocalizacoes && historicoLocalizacoes.length > 0) {
          const ultimaLocalizacao = historicoLocalizacoes[0];
          setLocalizacao({
            latitude: ultimaLocalizacao.latitude,
            longitude: ultimaLocalizacao.longitude,
            dataHora: ultimaLocalizacao.dataHora
          });
          setError(null);
        } else {
          setLocalizacao(null);
          setError(`Nenhuma localização encontrada para ${motorista.nome}`);
        }
      } else {
        const historicoLocalizacoes = await getLocalizacaoHistorico(motorista.id);
        
        if (historicoLocalizacoes && historicoLocalizacoes.length > 0) {
          const ultimaLocalizacao = historicoLocalizacoes[0];
          setLocalizacao({
            latitude: ultimaLocalizacao.latitude,
            longitude: ultimaLocalizacao.longitude,
            dataHora: ultimaLocalizacao.dataHora
          });
          setError(null);
        } else {
          setLocalizacao(null);
          setError(`Nenhuma localização encontrada para ${motorista.nome}`);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar localização:', err);
      setError('Erro ao carregar localização do motorista.');
      setLocalizacao(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar
        motoristas={motoristas}
        onSelectMotorista={handleSelectMotorista}
        motoristaSelecionado={motoristaSelecionado}
      />
      <div className="mapa-container">
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Carregando...</div>}
        <Mapa
          latitude={localizacao?.latitude}
          longitude={localizacao?.longitude}
          nomeMotorista={motoristaSelecionado?.nome}
        />
      </div>
    </div>
  );
}

export default App;

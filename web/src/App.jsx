import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Mapa from './components/Mapa';
import { getMotoristas, getLocalizacaoHistorico } from './services/api';
import { 
  USE_MOCK, 
  getMotoristaMock, 
  getLocalizacaoHistoricoMock 
} from './services/mockData';

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
          const data = await getMotoristaMock();
          setMotoristas(data);
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

  const fetchLocalizacao = async (motorista) => {
    try {
      if (USE_MOCK) {
        const historicoLocalizacoes = await getLocalizacaoHistoricoMock(motorista.id);
        
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
    }
  };

  useEffect(() => {
    if (!motoristaSelecionado) return;

    fetchLocalizacao(motoristaSelecionado);

    const intervalId = setInterval(() => {
      fetchLocalizacao(motoristaSelecionado);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [motoristaSelecionado]);

  const handleSelectMotorista = (motorista) => {
    setMotoristaSelecionado(motorista);
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
          dataHora={localizacao?.dataHora}
        />
      </div>
    </div>
  );
}

export default App;

export const USE_MOCK = true;

export const MOTORISTAS_MOCK = [
  { id: 1, nome: "João Silva", tipo: "MOTORISTA" },
  { id: 2, nome: "Maria Santos", tipo: "MOTORISTA" },
  { id: 3, nome: "Pedro Oliveira", tipo: "MOTORISTA" },
  { id: 4, nome: "Ana Costa", tipo: "MOTORISTA" },
  { id: 5, nome: "Carlos Souza", tipo: "MOTORISTA" }
];

export const LOCALIZACOES_MOCK = {
  1: [
    { 
      latitude: -23.5505, 
      longitude: -46.6333, 
      dataHora: "2026-01-26T10:30:00",
      velocidade: 60,
      endereco: "Av. Paulista, São Paulo - SP"
    },
    { 
      latitude: -23.5489, 
      longitude: -46.6388, 
      dataHora: "2026-01-26T10:15:00",
      velocidade: 45,
      endereco: "R. da Consolação, São Paulo - SP"
    }
  ],
  2: [
    { 
      latitude: -22.9068, 
      longitude: -43.1729, 
      dataHora: "2026-01-26T11:15:00",
      velocidade: 70,
      endereco: "Av. Rio Branco, Rio de Janeiro - RJ"
    },
    { 
      latitude: -22.9129, 
      longitude: -43.2003, 
      dataHora: "2026-01-26T11:00:00",
      velocidade: 55,
      endereco: "Copacabana, Rio de Janeiro - RJ"
    }
  ],
  3: [
    { 
      latitude: -19.9167, 
      longitude: -43.9345, 
      dataHora: "2026-01-26T09:45:00",
      velocidade: 80,
      endereco: "Av. Afonso Pena, Belo Horizonte - MG"
    },
    { 
      latitude: -19.9227, 
      longitude: -43.9451, 
      dataHora: "2026-01-26T09:30:00",
      velocidade: 50,
      endereco: "Savassi, Belo Horizonte - MG"
    }
  ],
  4: [
    { 
      latitude: -25.4284, 
      longitude: -49.2733, 
      dataHora: "2026-01-26T12:00:00",
      velocidade: 65,
      endereco: "Av. Cândido de Abreu, Curitiba - PR"
    }
  ],
  5: [
    { 
      latitude: -30.0346, 
      longitude: -51.2177, 
      dataHora: "2026-01-26T13:20:00",
      velocidade: 55,
      endereco: "Av. Ipiranga, Porto Alegre - RS"
    }
  ]
};

export const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getMotoristaMock = async () => {
  await mockDelay(500);
  return MOTORISTAS_MOCK;
};

export const getLocalizacaoHistoricoMock = async (motoristaId) => {
  await mockDelay(300);
  return LOCALIZACOES_MOCK[motoristaId] || [];
};

export const getUltimaLocalizacaoMock = async (motoristaId) => {
  await mockDelay(300);
  const historico = LOCALIZACOES_MOCK[motoristaId];
  return historico && historico.length > 0 ? historico[0] : null;
};

export const adicionarLocalizacaoMock = async (motoristaId, localizacao) => {
  await mockDelay(400);
  
  if (!LOCALIZACOES_MOCK[motoristaId]) {
    LOCALIZACOES_MOCK[motoristaId] = [];
  }
  
  const novaLocalizacao = {
    ...localizacao,
    dataHora: new Date().toISOString()
  };
  
  LOCALIZACOES_MOCK[motoristaId].unshift(novaLocalizacao);
  return novaLocalizacao;
};

export default {
  USE_MOCK,
  MOTORISTAS_MOCK,
  LOCALIZACOES_MOCK,
  mockDelay,
  getMotoristaMock,
  getLocalizacaoHistoricoMock,
  getUltimaLocalizacaoMock,
  adicionarLocalizacaoMock
};

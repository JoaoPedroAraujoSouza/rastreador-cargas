import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { MdMyLocation, MdPlayArrow, MdPause, MdHistory, MdGpsFixed } from 'react-icons/md';
import { FaTruckMoving, FaUserCircle } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import './Mapa.css';


const createTruckIcon = () => {
  const iconMarkup = renderToStaticMarkup(
      <div className="truck-icon-wrapper"><FaTruckMoving /></div>
  );
  return L.divIcon({ html: iconMarkup, className: 'custom-truck-icon', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });
};

const createAdminIcon = () => {
  const iconMarkup = renderToStaticMarkup(
      <div className="admin-icon-wrapper"><FaUserCircle /></div>
  );
  return L.divIcon({ html: iconMarkup, className: 'custom-admin-icon', iconSize: [35, 35], iconAnchor: [17.5, 17.5], popupAnchor: [0, -17.5] });
};


function RecentralizarMapa({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const Mapa = ({ latitude, longitude, nomeMotorista, dataHora, historico = [] }) => {
  const [userLocation, setUserLocation] = useState(null);

  // --- Estados do Replay ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [indiceReplay, setIndiceReplay] = useState(0);
  const [modoReplay, setModoReplay] = useState(false);


  const [manualCenter, setManualCenter] = useState(null);

  const timerRef = useRef(null);


  let centroMapa = [-23.55, -46.63]; // Default SP


  if (manualCenter) {
    centroMapa = manualCenter;
  }
  // 2. Modo Replay
  else if (modoReplay && historico.length > 0 && historico[indiceReplay]) {
    const p = historico[indiceReplay];
    centroMapa = [p.latitude, p.longitude];
  }

  else if (latitude && longitude) {
    centroMapa = [latitude, longitude];
  }

  const posCaminhao = (modoReplay && historico.length > 0 && historico[indiceReplay])
      ? historico[indiceReplay]
      : { latitude, longitude, timestamp: dataHora };

  const formatarDataHora = (dataString) => {
    if (!dataString) return '--:--';
    return new Date(dataString).toLocaleString();
  };


  useEffect(() => {
    if (isPlaying && modoReplay) {
      timerRef.current = setInterval(() => {
        setIndiceReplay((prev) => {
          // Verifica se chegou ao fim
          if (prev + 1 >= historico.length) {
            // Usa setTimeout para evitar update durante render (segurança extra)
            setTimeout(() => setIsPlaying(false), 0);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, modoReplay, historico.length]);

  const toggleReplayMode = () => {
    if (!modoReplay) {
      if (historico.length < 2) {
        alert("Histórico insuficiente para replay.");
        return;
      }
      setModoReplay(true);
      setIndiceReplay(0);
      setIsPlaying(true);
      setManualCenter(null); // Volta a seguir automaticamente ao iniciar replay
    } else {
      setModoReplay(false);
      setIsPlaying(false);
      setManualCenter(null); // Volta a seguir o caminhão ao sair
    }
  };

  const handleManualLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        const loc = [p.coords.latitude, p.coords.longitude];
        setManualCenter(loc); // Trava o mapa na posição do usuário
        setUserLocation(loc);
      });
    }
  };

  // Função para destrancar o mapa e voltar a seguir o caminhão
  const handleRecenterTruck = () => {
    setManualCenter(null);
  };

  const polylinePositions = historico.map(h => [h.latitude, h.longitude]);

  return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>

        {/* Botões de Controle */}
        <div className="map-controls">
          {/* Botão de Replay */}
          <button
              className={`btn-control ${modoReplay ? 'active' : ''}`}
              onClick={toggleReplayMode}
              title={modoReplay ? "Sair do Replay" : "Ver Histórico"}
          >
            <MdHistory />
          </button>

          {/* Botão de Minha Localização (Trava o mapa) */}
          <button
              className="btn-control"
              onClick={handleManualLocation}
              title="Minha Localização"
          >
            <MdMyLocation />
          </button>

          {}
          {manualCenter && (
              <button
                  className="btn-control highlight"
                  onClick={handleRecenterTruck}
                  title="Voltar a seguir o caminhão"
              >
                <MdGpsFixed />
              </button>
          )}
        </div>

        <MapContainer center={centroMapa} zoom={16} style={{ height: '100%', width: '100%' }}>
          <RecentralizarMapa center={centroMapa} />

          <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Trajeto Azul */}
          {(modoReplay || historico.length > 0) && (
              <Polyline
                  positions={polylinePositions}
                  pathOptions={{ color: '#3699ff', weight: 5, opacity: 0.7 }}
              />
          )}

          {userLocation && (
              <Marker position={userLocation} icon={createAdminIcon()} />
          )}

          {posCaminhao.latitude && posCaminhao.longitude && (
              <Marker position={[posCaminhao.latitude, posCaminhao.longitude]} icon={createTruckIcon()}>
                <Popup>
                  <div className="popup-content">
                    <strong>{nomeMotorista}</strong>
                    <div className="popup-status">
                      {modoReplay ? <span className="status-replay">REPLAY ▶</span> : <span className="status-live">AO VIVO ●</span>}
                    </div>
                    <div className="popup-datetime">
                      {formatarDataHora(posCaminhao.timestamp || posCaminhao.dataHora)}
                    </div>
                  </div>
                </Popup>
              </Marker>
          )}
        </MapContainer>

        {/* Barra de Replay */}
        {modoReplay && (
            <div className="replay-container">
              <div className="replay-bar">
                <button onClick={() => setIsPlaying(!isPlaying)} className="btn-play">
                  {isPlaying ? <MdPause /> : <MdPlayArrow />}
                </button>

                <input
                    type="range"
                    min="0"
                    max={historico.length - 1}
                    value={indiceReplay}
                    onChange={(e) => {
                      setIndiceReplay(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="replay-slider"
                />

                <div className="replay-info">
                  {indiceReplay + 1} / {historico.length}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Mapa;
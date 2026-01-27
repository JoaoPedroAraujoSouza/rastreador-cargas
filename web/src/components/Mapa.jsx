import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MdMyLocation } from 'react-icons/md';
import { FaTruckMoving, FaUserCircle } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import './Mapa.css';

import L from 'leaflet';

const createTruckIcon = () => {
  const iconMarkup = renderToStaticMarkup(
    <div className="truck-icon-wrapper">
      <FaTruckMoving />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-truck-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const createAdminIcon = () => {
  const iconMarkup = renderToStaticMarkup(
    <div className="admin-icon-wrapper">
      <FaUserCircle />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-admin-icon',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  });
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

const Mapa = ({ latitude, longitude, nomeMotorista, dataHora }) => {
  const [center, setCenter] = useState([-23.55, -46.63]);
  const [userLocation, setUserLocation] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return '';
    const data = new Date(dataHora);
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    return `Atualizado às ${horas}:${minutos} - ${dia}/${mes}`;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          if (initialLoad) {
            setCenter(location);
          }
          setUserLocation(location);
          setInitialLoad(false);
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
          setInitialLoad(false);
        }
      );
    } else {
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const recentralizar = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setCenter(location);
          setUserLocation(location);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização');
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <button className="btn-recentralizar" onClick={recentralizar} title="Recentralizar na minha localização">
        <MdMyLocation />
      </button>
      <MapContainer
        center={center}
        zoom={20}
        style={{ height: '100%', width: '100%' }}
      >
      <RecentralizarMapa center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marcador da localização do administrador */}
      {userLocation && (
        <Marker position={userLocation} icon={createAdminIcon()}>
          <Popup>
            <div className="popup-content">
              <strong>Minha Localização</strong>
              <div className="popup-datetime">Administrador</div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Marcador da localização do motorista */}
      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={createTruckIcon()}>
          <Popup>
            <div className="popup-content">
              <strong>{nomeMotorista || 'Localização'}</strong>
              {dataHora && (
                <div className="popup-datetime">
                  {formatarDataHora(dataHora)}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
    </div>
  );
};

export default Mapa;

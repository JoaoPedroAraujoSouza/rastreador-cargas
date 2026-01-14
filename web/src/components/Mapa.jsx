import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MdMyLocation } from 'react-icons/md';
import './Mapa.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function RecentralizarMapa({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

const Mapa = ({ latitude, longitude, nomeMotorista }) => {
  const [center, setCenter] = useState([-23.55, -46.63]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
        }
      );
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
          setCenter([position.coords.latitude, position.coords.longitude]);
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
      {latitude && longitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>
            {nomeMotorista || 'Localização'}
          </Popup>
        </Marker>
      )}
    </MapContainer>
    </div>
  );
};

export default Mapa;

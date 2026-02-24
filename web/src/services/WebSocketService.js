import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// URL do seu Backend
const SOCKET_URL = 'http://localhost:8080/ws-tracker';

class WebSocketService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect(token, onConnected, onError) {
        // Se já estiver conectado, não faz nada
        if (this.client && this.client.active) {
            return;
        }

        this.client = new Client({
            // Usa SockJS para compatibilidade com o Spring Boot .withSockJS()
            webSocketFactory: () => new SockJS(SOCKET_URL),

            // Envia o Token JWT no header de conexão (conforme configuramos no Backend)
            connectHeaders: {
                'Authorization': `Bearer ${token}`
            },

            // Configurações de Debug e Reconexão
            debug: (str) => {
                console.log('[WS Debug]:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('WebSocket Conectado!');
                this.isConnected = true;
                if (onConnected) onConnected();
            },

            onStompError: (frame) => {
                console.error('Erro no Broker:', frame.headers['message']);
                console.error('Detalhes:', frame.body);
                if (onError) onError(frame);
            },

            onWebSocketClose: () => {
                console.log('Conexão WebSocket fechada');
                this.isConnected = false;
            }
        });

        this.client.activate();
    }

    subscribeToDriver(driverId, callback) {
        if (!this.client || !this.isConnected) {
            console.warn('Tentativa de inscrição sem conexão ativa.');
            return null;
        }

        // O tópico deve bater com o que o Backend envia: /topic/driver/{id}
        const topic = `/topic/driver/${driverId}`;
        console.log(`Inscrevendo-se no tópico: ${topic}`);

        return this.client.subscribe(topic, (message) => {
            if (message.body) {
                const locationData = JSON.parse(message.body);
                callback(locationData);
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
            console.log('WebSocket desconectado manualmente');
        }
    }
}

// Exporta uma instância única (Singleton)
export default new WebSocketService();
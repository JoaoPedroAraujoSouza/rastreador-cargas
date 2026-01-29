import { createContext, useState, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            return JSON.parse(storedUser);
        }
        return null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await apiLogin({ username, password });

            // 1. Salva o Token
            localStorage.setItem('token', response.token);

            // 2. CRÍTICO: Mapear os campos exatos que vêm do Backend (LoginResponseDTO)
            // O Backend manda 'userType', não 'role'.
            const userData = {
                username: response.username,
                userType: response.userType, // <--- CORREÇÃO AQUI
                id: response.id
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return true;
        } catch (error) {
            console.error("Erro no login:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const registerAdmin = async (data) => {
        setLoading(true);
        try {
            // Ajuste para garantir que o registro via contexto também siga o padrão
            const payload = { ...data, userType: 'ADMIN' };
            await apiRegister(payload);
            await login(data.username, data.password);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signed: !!user, login, registerAdmin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
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
        setLoading(true); // Opcional: Feedback visual durante o login
        try {
            const response = await apiLogin({ username, password });

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
                username: response.username,
                role: response.role
            }));

            setUser({ username: response.username, role: response.role });
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
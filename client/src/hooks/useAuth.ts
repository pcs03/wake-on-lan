import { useContext, useEffect } from 'react';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

interface AuthResponse {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
}

export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const user = localStorage.getItem('user');

        console.log(user);

        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    const register = async (user: UserFormFields): Promise<AuthResponse> => {
        const userServiceResponse = await authService.register(user);

        if (!userServiceResponse.success || !userServiceResponse.data) {
            return {
                success: false,
                errorCode: userServiceResponse.status,
                errorMessage: userServiceResponse.errorMessage,
            };
        }

        setUser(userServiceResponse.data);
        localStorage.setItem('user', JSON.stringify(userServiceResponse.data));
        return {
            success: true,
        };
    };

    const login = async (user: UserFormFields) => {
        const userServiceResponse = await authService.login(user);

        if (!userServiceResponse.success || !userServiceResponse.data) {
            return {
                success: false,
                errorCode: userServiceResponse.status,
                errorMessage: userServiceResponse.errorMessage,
            };
        }

        setUser(userServiceResponse.data);
        localStorage.setItem('user', JSON.stringify(userServiceResponse.data));

        return {
            success: true,
        };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return { user, setUser, register, login, logout };
};

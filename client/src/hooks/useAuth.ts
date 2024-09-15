import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useUser } from './useUser';
import authService from '../services/authService';

export const useAuth = () => {
    const { user, setUser, removeUser, addUser } = useUser();
    const { getItem } = useLocalStorage();

    useEffect(() => {
        const user = getItem('user');
        if (user) {
            addUser(JSON.parse(user));
        }
    }, [addUser, getItem]);

    const register = async (user: UserFormFields) => {
        const userCredentials = await authService.register(user);

        addUser(userCredentials);
    };

    const login = async (user: UserFormFields) => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();

                return {
                    success: false,
                    error: errorData.message || 'Unknown error occurred',
                };
            }

            const data = await response.json();
            await addUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    };

    const logout = () => {
        removeUser();
    };

    return { user, register, login, logout, setUser };
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const USERS_STORAGE_KEY = '@sragranel_users';

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize — just mark as loaded
        setIsLoading(false);
    }, []);

    const getStoredUsers = async () => {
        try {
            const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    };

    const signup = async (name, email, password, storeName) => {
        try {
            const users = await getStoredUsers();

            // Check if email already exists
            const emailLower = email.trim().toLowerCase();
            const exists = users.find(u => u.email === emailLower);
            if (exists) {
                return { success: false, message: 'Este e-mail já está cadastrado.' };
            }

            const newUser = {
                id: Date.now().toString(),
                name: name.trim(),
                email: emailLower,
                password: password,
                storeName: storeName,
                role: 'demander',
                createdAt: new Date().toISOString(),
            };

            const updatedUsers = [...users, newUser];
            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

            return { success: true, message: 'Conta criada com sucesso!' };
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            return { success: false, message: 'Erro ao criar conta. Tente novamente.' };
        }
    };

    const login = async (email, password) => {
        try {
            const users = await getStoredUsers();
            const emailLower = email.trim().toLowerCase();
            const user = users.find(u => u.email === emailLower && u.password === password);

            if (user) {
                const { password: _, ...userWithoutPassword } = user;
                setCurrentUser(userWithoutPassword);
                return { success: true, user: userWithoutPassword };
            }

            return { success: false, message: 'E-mail ou senha incorretos.' };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

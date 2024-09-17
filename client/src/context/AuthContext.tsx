import { Dispatch, SetStateAction, createContext, useState, ReactNode } from 'react';

interface AuthContextInterface {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextInterface>({
    user: null,
    setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const value = { user, setUser };

    return (
        <>
            <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
        </>
    );
};

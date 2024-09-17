import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
    children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default Protected;

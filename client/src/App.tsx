import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '@/scenes/Navbar/Navbar';
import Home from './scenes/Home/Home';
import Login from './scenes/Login/Login';
import React from 'react';
import Register from './scenes/Register/Register';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
    const [theme, colorMode] = useMode();
    const { user, setUser } = useAuth();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthContext.Provider value={{ user, setUser }}>
                    <div className="app">
                        <BrowserRouter>
                            <Box width="100%" height="100%" p="1rem 0.5rem 4rem 0.5rem">
                                <Navbar />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                </Routes>
                            </Box>
                        </BrowserRouter>
                        <ToastContainer />
                    </div>
                </AuthContext.Provider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;

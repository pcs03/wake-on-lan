import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from '@/theme';
import FormInputText from '@/components/FormInputText';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const defaultValues = {
    username: '',
    password: '',
};

const Login: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { user, setUser, register, login, logout } = useAuth();

    const { handleSubmit, control, setError } = useForm<UserFormFields>({
        defaultValues: defaultValues,
    });

    // async function login(payload: { username: string; password: string }) {
    //     console.log(payload);
    //     const response = await fetch(`http://${process.env.API_HOST}/login`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(payload),
    //     });
    //     const body = await response.json();
    //     const success = body['success'];
    //     const token = body['token'];
    //     const expIn = body['exp'];
    //
    //     if (success) {
    //         signIn({
    //             token: token,
    //             expiresIn: expIn / 60,
    //             tokenType: 'Bearer',
    //             authState: { username: payload.username },
    //         });
    //
    //         navigate('/');
    //     } else {
    //         console.log('Error login in');
    //         setError('username', { type: 'custom', message: 'Incorrect' });
    //         setError('password', { type: 'custom', message: 'Incorrect' });
    //     }
    // }
    //
    //

    const onSubmit = async (data: UserFormFields) => {
        const loginStatus = await login(data);

        console.log(loginStatus);

        if (loginStatus.error) {
            setError('username', { type: 'custom', message: loginStatus.error });
            setError('password', { type: 'custom', message: loginStatus.error });

            // TODO: toast


            return;
        }

        // TODO: toast?

        navigate('/');
    };

    return (
        <Box maxWidth="500px" margin="auto">
            <form>
                <Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem 0">
                    Login
                </Typography>

                <FormInputText name="username" control={control} label="Username" />
                <FormInputText name="password" control={control} label="Password" password={true} />

                <Button
                    onClick={handleSubmit((data: UserFormFields) => onSubmit(data))}
                    variant="contained"
                    color="secondary"
                    sx={{ m: '0.5rem 0' }}
                    type="submit"
                >
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;

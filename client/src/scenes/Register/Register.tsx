import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from '@/theme';
import FormInputText from '@/components/FormInputText';
import { useAuth } from '../../hooks/useAuth';

type RegisterFormValues = {
    username: string;
    password: string;
    password2: string;
};

const defaultValues = {
    username: '',
    password: '',
    password2: '',
};

const Register: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { register } = useAuth();

    const { handleSubmit, control, setError } = useForm<RegisterFormValues>({
        defaultValues: defaultValues,
    });

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        if (!(data.password == data.password2)) {
            setError('password', { type: 'custom', message: "Passwords don't match" });
            setError('password2', { type: 'custom', message: "Passwords don't match" });
            // toast error
            //
            return;
        }

        const registerResponse = await register({ username: data.username, password: data.password });

        if (!registerResponse.success) {
            // toast error

            if (registerResponse.errorCode == 401) {
                setError('username', { type: 'custom', message: 'Invalid credentials' });
                setError('password', { type: 'custom', message: 'Invalid credentials' });
            }

            return;
        }

        navigate('/');
    };

    return (
        <Box maxWidth="500px" margin="auto">
            <form>
                <Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem 0">
                    Register
                </Typography>

                <FormInputText name="username" control={control} label="Username" />
                <FormInputText name="password" control={control} label="Password" password={true} />
                <FormInputText name="password2" control={control} label="Confirm password" password={true} />

                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="secondary"
                    sx={{ m: '0.5rem 0' }}
                    type="submit"
                >
                    Register
                </Button>
            </form>
        </Box>
    );
};
export default Register;

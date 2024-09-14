const login = async (payload: { username: string; password: string }) => {
    console.log(payload);
    const response = await fetch('/api/users/login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const body: User = await response.json();

    if (body) {
        localStorage.setItem('user', JSON.stringify(body));
    }

    return body;
};

const register = async (payload: { username: string; password: string }) => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const body: User = await response.json();

    if (body) {
        localStorage.setItem('user', JSON.stringify(body));
    }

    return body;
};

const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;

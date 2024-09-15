const login = async (payload: UserFormFields): Promise<boolean> => {
    console.log(payload);
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
        return false
        // TODO: Implement toast
    }

    const body: User = await response.json();
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

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
        // TODO: Implement toast
    }

    const body: User = await response.json();
    return body;
};

const authService = {
    register,
    login,
};

export default authService;

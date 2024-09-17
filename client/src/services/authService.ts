interface UserApiErrorResponse {
    message: string;
    stack?: string;
}

const login = async (userFields: UserFormFields): Promise<ServiceResponse<User>> => {
    console.log(userFields);
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFields),
    });

    if (!response.ok) {
        const responseBody: UserApiErrorResponse = await response.json();

        return {
            success: false,
            status: response.status,
            errorMessage: responseBody.message,
        };
    }

    const responseBody: User = await response.json();

    return {
        success: true,
        status: response.status,
        data: responseBody,
    };
};

const register = async (userFields: UserFormFields): Promise<ServiceResponse<User>> => {
    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFields),
    });

    if (!response.ok) {
        const responseBody: UserApiErrorResponse = await response.json();

        return {
            success: false,
            status: response.status,
            errorMessage: responseBody.message,
        };
    }

    const responseBody: User = await response.json();
    return {
        success: true,
        status: response.status,
        data: responseBody,
    };
};

const authService = {
    register,
    login,
};

export default authService;

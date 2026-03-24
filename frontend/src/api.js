const BASE_URL =
    process.env.REACT_APP_API_URL ||
    'https://merntaskchallange.onrender.com/api';

export const requestConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
};

export default BASE_URL;

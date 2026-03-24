const deployedApiUrl =
    process.env.REACT_APP_API_URL ||
    'https://merntaskchallange.onrender.com/api';

const localApiUrl =
    process.env.REACT_APP_API_URL_LOCAL ||
    'http://localhost:5000/api';

const isLocalFrontend =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

const BASE_URL = isLocalFrontend ? localApiUrl : deployedApiUrl;

export const requestConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
};

export default BASE_URL;

import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const API = axios.create({
    baseURL: `${API_URL}/api/birthdays`,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor: attach token and api
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }

    if (API_KEY) {
        config.headers['x-api-key'] = API_KEY;
    }
    return config
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor: auto logout on 401 Unauthorised
API.interceptors.response.use(
    (response) => response, //if success just return the response
    (error) => {
        const token = localStorage.getItem('token');
        
        if(error.response && error.response.status === 401 && token) {
            toast.error('Session expired. Please login again');
            localStorage.removeItem('token'); //removes expired token
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000); //gives user 2 seconds to see the toast
        }
        return Promise.reject(error); //allow other errors to flow through
    }
)

export const getBirthdays = () => API.get('/');
export const addBirthday = (birthday) => API.post('/', birthday);
export const editBirthday = (_id, name, date) => API.put(`/${_id}`, { name, date });
export const deleteBirthday = (_id) => API.delete(`/${_id}`);
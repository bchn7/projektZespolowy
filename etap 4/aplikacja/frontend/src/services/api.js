import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
    }
});

export default api;
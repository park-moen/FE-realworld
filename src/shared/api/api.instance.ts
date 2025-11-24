import axios from 'axios';
import { store } from '~shared/store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const { session } = store.getState();
    console.log('session', session);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }

    return config;
  },
  (error) => {
    console.log('error', error);

    return Promise.reject(error);
  },
);

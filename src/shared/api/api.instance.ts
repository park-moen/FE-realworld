import axios from 'axios';
import { store } from '~shared/store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
});

console.log('✅ Axios instance created!');

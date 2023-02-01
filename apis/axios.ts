import axios from 'axios';
import { BASE_URL } from 'constants/api';

const api = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? BASE_URL.DEV : BASE_URL.DEV,
});

export default api;

import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.147:3000',
});

export default AxiosInstance;

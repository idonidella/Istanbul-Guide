import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3000', //android emülatör için

});

export default AxiosInstance;

import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.147:3000', 
  //kendi internetiniz ip adresinizi buraya yazın
});

export default AxiosInstance;

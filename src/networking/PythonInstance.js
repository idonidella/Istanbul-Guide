import axios from 'axios';

const PythonInstance = axios.create({
  baseURL: 'http://10.0.2.2:5001', //android emülatör için python server 

});

export default PythonInstance;

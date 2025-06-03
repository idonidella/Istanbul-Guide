import axios from 'axios';

const PythonInstance = axios.create({
  baseURL: 'http://10.0.2.2:5001', 
});

export default PythonInstance;

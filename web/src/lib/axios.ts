import axios from 'axios';
const baseURL = process.env.API_URL;

console.log(baseURL);
export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

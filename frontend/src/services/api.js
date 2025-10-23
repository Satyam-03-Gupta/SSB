import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getMenu = () => {
  return axios.get(`${apiUrl}/menu`);
};

export const createOrder = (orderData) => {
  return axios.post(`${apiUrl}/orders`, orderData);
};
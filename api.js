// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_DB_URL;

export const getAllProperty = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const addProperty = async (item) => {
  try {
    const response = await axios.post(`${API_URL}`, item);
    return response.data;
  } catch (error) {
    console.error('Error adding item', error);
    throw error;
  }
};

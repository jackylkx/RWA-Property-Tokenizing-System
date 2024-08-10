// src/property_api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_DB_URL;

export const getAllProperty = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getAllPropertyByListing = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getPropertiesBySeller = async (seller) => {
  try {
    const response = await axios.get(`${API_URL}/seller/${seller}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getAllPropertyById = async (propertyId) => {
  try {
    const response = await axios.get(`${API_URL}/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const listProperty = async (propertyId,_purchasePrice,_deposit) => {
  try {
    const data = {
      isListed: true,
      purchasePrice: _purchasePrice,
      deposit: _deposit,
    };

    console.log(data);
    const response = await axios.put(`${API_URL}/${propertyId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating item', error);
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

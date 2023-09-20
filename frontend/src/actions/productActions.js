import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

import axios from "axios";

//------------------------------
// Get All Products
//------------------------------
export const getProducts = (
  productsCountPerPage = 8,
  currentPage = 1,
  keyword = "",
  price,
  category = [],
  rating
) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_PRODUCTS_REQUEST,
    });

    let url = `/api/v1/products?limit=${productsCountPerPage}&page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`;

    if (category.length > 0) {
      url += `&category=${category}`;
    }

    const { data } = await axios.get(url);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

//------------------------------
// Clear Errors
//-------------------------------
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

//------------------------------
// Get Product Details
//-------------------------------
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

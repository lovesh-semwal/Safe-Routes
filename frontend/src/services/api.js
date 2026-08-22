import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// GET SAFE ROUTES
// ==========================================

export const getSafeRoutes = async (data) => {
  try {
    const response = await API.post(
      "/routes",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "getSafeRoutes error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ==========================================
// GET SAFETY DATA
// ==========================================

export const getSafetyData = async (params) => {
  try {
    const response = await API.get(
      "/safety",
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "getSafetyData error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ==========================================
// SUBMIT SAFETY REPORT
// ==========================================

export const submitSafetyReport = async (
  data
) => {
  try {
    const response = await API.post(
      "/reports",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "submitSafetyReport error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

export default API;
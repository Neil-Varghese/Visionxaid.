// src/services/api.js
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

/**
 * Upload an image for prediction
 * @param {File} imageFile - The image file to predict
 * @returns {Promise} Prediction results
 */
export const predictImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    console.log("Fetching from:", `${API_BASE_URL}/predict`);
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", {
      contentType: response.headers.get("content-type"),
      contentEncoding: response.headers.get("content-encoding"),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Prediction failed");
    }

    const data = await response.json();
    console.log("Parsed response:", data);
    return data;
  } catch (error) {
    console.error("Error in predictImage:", error);
    throw error;
  }
};

/**
 * Generate PDF report
 * @param {Object} payload - Report data including images and prediction
 * @returns {Promise} PDF blob
 */
export const generatePDF = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "PDF generation failed");
    }

    // Return as blob for download
    return await response.blob();
  } catch (error) {
    console.error("Error in generatePDF:", error);
    throw error;
  }
};

/**
 * Check backend health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error("Error checking backend health:", error);
    throw error;
  }
};
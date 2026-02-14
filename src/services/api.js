// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Upload an image for prediction
 * @param {File} imageFile - The image file to predict
 * @returns {Promise} Prediction results
 */
export const predictImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Prediction failed");
    }

    return await response.json();
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
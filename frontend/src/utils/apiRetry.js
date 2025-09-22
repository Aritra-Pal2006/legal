/**
 * Utility function to handle API calls with automatic retry for rate limiting
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.baseDelay - Base delay in milliseconds (default: 1000)
 * @returns {Promise} - Promise that resolves with the API response
 */
export const apiCallWithRetry = async (apiCall, options = {}) => {
  const { maxRetries = 3, baseDelay = 1000 } = options;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      // If it's not a rate limit error or we've reached max retries, throw the error
      if (error.response?.status !== 429 || i === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const retryAfter = error.response.data.retryAfter || 60;
      const delay = Math.min(baseDelay * Math.pow(2, i), retryAfter * 1000);
      const jitter = Math.random() * 1000; // Add up to 1 second of jitter
      const totalDelay = delay + jitter;
      
      console.log(`Rate limit hit. Retrying in ${totalDelay}ms...`);
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }
};

export default apiCallWithRetry;
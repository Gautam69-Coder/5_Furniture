import { message } from "antd";

/**
 * Extracts a user-friendly error message from any error object (Axios, Network, Firebase, etc.).
 * @param {any} error
 * @param {string} defaultMessage
 * @returns {string}
 */
export const getErrorMessage = (error, defaultMessage = "Something went wrong. Please try again.") => {
  if (!error) return defaultMessage;
  if (typeof error === "string") return error;

  // Firebase auth errors
  if (error.code) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completing.";
      case "auth/popup-blocked":
        return "Sign-in popup was blocked by your browser. Please allow popups.";
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        break;
    }
  }

  // Axios error response
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string" && !data.startsWith("<")) {
      return data;
    }
    if (data.message && typeof data.message === "string") {
      return data.message;
    }
    if (data.error && typeof data.error === "string") {
      return data.error;
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((e) => (typeof e === "string" ? e : e.message || JSON.stringify(e)))
        .join(", ");
    }
  }

  // HTTP status codes fallback
  if (error.response?.status) {
    const status = error.response.status;
    if (status === 400) return "Invalid request. Please check the details you entered.";
    if (status === 401) return "Session expired or unauthorized. Please log in.";
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested item or resource was not found.";
    if (status === 409) return "A conflict occurred. The record may already exist.";
    if (status >= 500) return "Server error. Please try again later.";
  }

  // Axios network error
  if (error.message === "Network Error") {
    return "Network error. Unable to connect to the server. Please check your internet connection.";
  }

  if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Display an error message using antd message.
 * @param {any} error
 * @param {string} defaultMessage
 */
export const showError = (error, defaultMessage = "Something went wrong. Please try again.") => {
  const msg = getErrorMessage(error, defaultMessage);
  message.error(msg);
  return msg;
};

/**
 * Display a success message using antd message.
 * @param {string} msg
 */
export const showSuccess = (msg) => {
  message.success(msg);
};

/**
 * Display a warning message using antd message.
 * @param {string} msg
 */
export const showWarning = (msg) => {
  message.warning(msg);
};


import axios from "axios";

export const commonrequest = async (method, url, body, header) => {
  try {
    const config = {
      method,
      url,
      headers: header || {},
    };

    // Only add body for methods that support it
    if (body) {
      config.data = body;

      // If the body is FormData, let axios handle Content-Type automatically
      if (!(body instanceof FormData) && !header) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
      return error.response;
    } else if (error.request) {
      console.error("No response received:", error.request);
      return { message: "No response received", request: error.request };
    } else {
      console.error("Error in setting up request:", error.message);
      return { message: error.message };
    }
  }
};

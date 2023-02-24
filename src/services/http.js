import axios from "axios";
import pluginData from "./data.json";
const { wooconvo_rest_nonce } = pluginData;

// New axio interceptor syntax from
// source: https://stackoverflow.com/questions/68714143/how-can-i-use-axios-interceptors-to-add-some-headers-to-responses
axios.interceptors.request.use(
  (config) => {
    if (wooconvo_rest_nonce) {
      config.headers["X-WP-Nonce"] = wooconvo_rest_nonce;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response;
  },
  (error) => {
    // Handle error
    console.log(error);
    const expectedErrors =
      error.response &&
      error.respons.status >= 400 &&
      error.respons.status < 500;

    if (!expectedErrors) {
      alert("An unexpected error occurred!");
    }
    return Promise.reject(error);
  }
);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

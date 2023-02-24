// import config from "../config";
import httpService from "./http";
import pluginData from "./data.json";

const { siteurl } = pluginData;
const endpoint = `${siteurl}/wp-json/designerpick/v1`;

export function doLogin(user_info) {
  const url = `${endpoint}/login`;
  // console.log(url);
  return httpService.post(url, user_info);
}

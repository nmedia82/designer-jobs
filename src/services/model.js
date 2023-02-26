// import config from "../config";
import httpService from "./http";
import pluginData from "./data.json";

const { siteurl } = pluginData;
const endpoint = `${siteurl}/wp-json/designerpick/v1`;

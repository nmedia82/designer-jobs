import data from "./../services/data.json";

export const get_setting = (key, defaultValue = "") => {
  var settings = localStorage.getItem("orderconvo_settings");
  if (!settings) return defaultValue;
  settings = JSON.parse(settings);
  if (!settings[key]) return defaultValue;
  return settings[key];
};

export function get_orderconvo_api_url() {
  return `${data.siteurl}/wp-json/wooconvo/v1`;
}

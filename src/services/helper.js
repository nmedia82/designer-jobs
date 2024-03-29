import data from "./../services/data.json";

export const get_setting = (key, defaultValue = "") => {
  var settings = localStorage.getItem("jobdone_settings");
  if (!settings) return defaultValue;
  settings = JSON.parse(settings);
  if (!settings[key]) return defaultValue;
  return settings[key];
};

export const wooconvo_makeid = (length = 6) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const _to_options = (options) => {
  return Object.keys(options).map((b) => ({
    value: b,
    label: options[b],
  }));
};

export function get_orderconvo_api_url() {
  return `${data.siteurl}/wp-json/wooconvo/v1`;
}

export function get_job_thumb(job) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/download-icon.png"}
      width="75"
      alt={job.orderID}
    />
  );
}

export function get_preview_thumb() {
  return process.env.PUBLIC_URL + "/download-icon.png";
}

export function jobdone_date(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

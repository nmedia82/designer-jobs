// import config from "../config";
import httpService from "./http";
import pluginData from "./data.json";

const { siteurl } = pluginData;
const endpoint = `${siteurl}/wp-json/jobdone/v1`;

export async function login(user_info) {
  const url = `${endpoint}/login`;
  const { data } = await httpService.post(url, user_info);
  // console.log(user.success);
  const { success, data: response } = data;
  if (success) {
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("wc_statuses", JSON.stringify(response.statuses));

    return;
  }

  throw new Error("Username/password is invalid");
}

export function logout() {
  localStorage.removeItem("user");
}

export function getUserID() {
  try {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    return user.ID;
  } catch (ex) {
    return null;
  }
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  } catch (ex) {
    return null;
  }
}

export function getUserRole() {
  try {
    const user = getCurrentUser();
    const { roles } = user;

    if (roles.includes("designer")) return "designer";
    if (roles.includes("administrator")) return "admin";
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
};

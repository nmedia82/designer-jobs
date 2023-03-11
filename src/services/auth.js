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
    const allowed = ["wc-in-progress", "wc-revise", "wc-send"];
    let statuses = Object.fromEntries(
      Object.entries(response.statuses).filter(([key, value]) =>
        allowed.includes(key)
      )
    );
    statuses = { "": "Select", ...statuses };
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("wc_statuses", JSON.stringify(statuses));
    localStorage.setItem("user_roles", JSON.stringify(response.user_roles));

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
    let roles = localStorage.getItem("user_roles");
    roles = JSON.parse(roles);

    if (roles.includes("administrator")) return "admin";
    if (roles.includes("designer")) return "designer";
    if (roles.includes("customer")) return "customer";
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
};

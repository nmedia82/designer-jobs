// import config from "../config";
import httpService from "./http";
import pluginData from "./data.json";
import { getUserID, getUserRole } from "./auth";
import { get_setting } from "./helper";

const { siteurl } = pluginData;
const endpoint = `${siteurl}/wp-json/jobdone/v1`;
const endpoint_orderconvo = `${siteurl}/wp-json/wooconvo/v1`;

// get order details by id
export function getOrderById(order_id) {
  const url = `${endpoint_orderconvo}/get-order-detail?order_id=${order_id}`;
  return httpService.get(url);
}

// add message in order
export function addMessage(order_id, message, attachments = []) {
  const user_id = getUserID();
  const user_role = getUserRole();
  const context = user_role === "designer" ? "wp_admin" : "myaccount";
  const url = `${endpoint_orderconvo}/add-message`;
  const data = { message, user_id, order_id, attachments, context };
  return httpService.post(url, data);
}

export function resetUnread(order_id) {
  const user_type = "vendor";
  const data = { order_id, user_type };
  const url = `${endpoint_orderconvo}/reset-unread`;
  return httpService.post(url, data);
}

export function getOpenJobs() {
  const user_id = getUserID();
  const url = `${endpoint}/get-open-jobs?user_id=${user_id}`;
  return httpService.get(url);
}

export function getInProgressJobs() {
  const user_id = getUserID();
  const url = `${endpoint}/get-in-progress-jobs?user_id=${user_id}`;
  return httpService.get(url);
}

export function getCompletedJobs() {
  const user_id = getUserID();
  const url = `${endpoint}/get-completed-jobs?user_id=${user_id}`;
  return httpService.get(url);
}

export function getCancelledJobs() {
  const user_id = getUserID();
  const url = `${endpoint}/get-cancelled-jobs?user_id=${user_id}`;
  return httpService.get(url);
}

export function getJobByDate(context, after, before) {
  const user_id = getUserID();
  const url = `${endpoint}/get-jobs-dates?user_id=${user_id}&after=${after}&before=${before}&context=${context}`;
  return httpService.get(url);
}

export function getDesignerUsers() {
  const user_id = getUserID();
  const url = `${endpoint}/get-designers`;
  return httpService.get(url);
}

export function getJobsInfo() {
  const user_id = getUserID();
  const url = `${endpoint}/get-jobs-info?user_id=${user_id}`;
  return httpService.get(url);
}

export function requestJob(order_id, user_id) {
  const request_type = get_setting("automatic_mode") ? "direct" : "wait";
  const data = { user_id, order_id, request_type };
  const url = `${endpoint}/request-job`;
  return httpService.post(url, data);
}

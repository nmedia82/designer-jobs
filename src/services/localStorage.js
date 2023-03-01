export function getStatuses() {
  try {
    let statuses = localStorage.getItem("wc_statuses");
    statuses = JSON.parse(statuses);
    return statuses;
  } catch (ex) {
    return null;
  }
}

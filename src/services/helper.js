export function getUserRole() {
  const user_info = localStorage.getItem("user_info");
  console.log(typeof user_info);
  if ("null" === user_info) return null;
  const { roles } = JSON.parse(user_info);

  if (roles.includes("designer")) return "designer";
  if (roles.includes("administrator")) return "admin";
}

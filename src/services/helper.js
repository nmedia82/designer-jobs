export function getUserRole() {
  let user_info = localStorage.getItem("user_info");
  console.log(typeof user_info, user_info);
  if (!user_info) return null;
  user_info = JSON.parse(user_info);

  const { roles } = user_info;

  if (roles.includes("designer")) return "designer";
  if (roles.includes("administrator")) return "admin";
}

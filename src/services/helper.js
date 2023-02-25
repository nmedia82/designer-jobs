export function getUserRole() {
  let user_info = localStorage.getItem("user_info");
  user_info = JSON.parse(user_info);
  console.log(!user_info);
  if (!user_info.data) return null;
  const { roles } = user_info;

  if (roles.includes("designer")) return "designer";
  if (roles.includes("administrator")) return "admin";
}

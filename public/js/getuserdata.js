//Module to pull the users data (email & ID) from the DB and export to other js files
export const getUserData = async () => {
  const userData = await $.get("/api/user_data");
  return await userData;
};

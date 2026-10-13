import { getCurrentUser, updateCurrentUser } from "./userData";

const defaultProfile = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  age: 32,
  phone: "15550123456",
  role: "admin",
  profilePicture: "",
};

export const getProfileData = () => ({
  ...defaultProfile,
  ...getCurrentUser(),
});

export const saveProfileData = (profile) => {
  const profileDetails = { ...profile };
  delete profileDetails.password;
  delete profileDetails.confirmPassword;
  return updateCurrentUser(profileDetails);
};

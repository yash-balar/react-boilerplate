import { ROLES } from "../constants/permissions";
import { addDummyManager } from "./dummyManagerData";
import {
  createUser,
  getUserByEmail,
  startSession,
} from "./userData";

export const login = ({ email, password }) => {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Email or password is incorrect.");
  }
  return startSession(user);
};

export const register = (user) => {
  const newUser = { ...user };
  delete newUser.confirmPassword;

  const createdUser = createUser(newUser);
  if (createdUser.role === ROLES.MANAGER) {
    addDummyManager({
      name: `${createdUser.firstName} ${createdUser.lastName}`,
      email: createdUser.email,
      phone: createdUser.phone,
      department: "Unassigned",
      status: "Active",
    });
  }
  return createdUser;
};

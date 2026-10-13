import { ROLES } from "../constants/permissions";

const USERS_STORAGE_KEY = "workspace.users";
const SESSION_STORAGE_KEY = "workspace.session";

const defaultUsers = [
  {
    id: "user-admin",
    firstName: "Alex",
    lastName: "Morgan",
    email: "admin@workspace.com",
    age: 32,
    phone: "15550123456",
    role: ROLES.ADMIN,
    password: "Demo1234",
    profilePicture: "",
  },
  {
    id: "user-manager",
    firstName: "Olivia",
    lastName: "Rhye",
    email: "olivia.rhye@example.com",
    age: 30,
    phone: "15550123401",
    role: ROLES.MANAGER,
    password: "Demo1234",
    profilePicture: "",
  },
  {
    id: "user-employee",
    firstName: "Jamie",
    lastName: "Chen",
    email: "employee@workspace.com",
    age: 26,
    phone: "15550123402",
    role: ROLES.EMPLOYEE,
    password: "Demo1234",
    profilePicture: "",
  },
];

const readUsers = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers === null) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers.map((user) => ({ ...user }));
  }

  const users = JSON.parse(storedUsers);
  if (!Array.isArray(users)) {
    throw new Error("Saved user data is invalid. Clear the workspace.users browser storage and try again.");
  }
  return users;
};

const withoutPassword = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};

export const getUsers = () => readUsers().map(withoutPassword);

export const getUserByEmail = (email) =>
  readUsers().find((user) => user.email.toLocaleLowerCase() === email.trim().toLocaleLowerCase());

export const createUser = (user) => {
  const users = readUsers();
  const email = user.email.trim().toLocaleLowerCase();
  if (users.some((existingUser) => existingUser.email.toLocaleLowerCase() === email)) {
    throw new Error("An account with this email address already exists.");
  }
  if (![ROLES.EMPLOYEE, ROLES.MANAGER].includes(user.role)) {
    throw new Error("Only employee and manager accounts can be registered.");
  }

  const newUser = {
    ...user,
    id: window.crypto.randomUUID(),
    email,
    profilePicture: "",
  };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
  return withoutPassword(newUser);
};

export const getCurrentUser = () => {
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) return null;
  const user = readUsers().find((item) => item.id === sessionId);
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
  return withoutPassword(user);
};

export const startSession = (user) => {
  localStorage.setItem(SESSION_STORAGE_KEY, user.id);
  return withoutPassword(user);
};

export const endSession = () => localStorage.removeItem(SESSION_STORAGE_KEY);

export const updateCurrentUser = (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("You must be signed in to update your profile.");

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  const email = updates.email?.trim().toLocaleLowerCase();
  if (email && users.some((user, index) => index !== userIndex
    && user.email.toLocaleLowerCase() === email)) {
    throw new Error("Another account already uses this email address.");
  }
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    ...(email ? { email } : {}),
    role: users[userIndex].role,
  };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return withoutPassword(users[userIndex]);
};

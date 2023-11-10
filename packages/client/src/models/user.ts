import localforage from "localforage";

const apiHost = 'http://localhost:3000';

export async function getUsers() {
  const users = await fetch(`${apiHost}/users`).then(result => result.json() || []);
  return users;
}

export async function createAndSetLoggedUser(name) {
  const user = await createUser(name);
  localforage.setItem("current-user", user.id);
  return user;
}

export async function createUser(name) {
  const response = await fetch(`${apiHost}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const user = await response.json();
  return user;
}

export async function getLoggedUser() {
  const loggedUserId = await localforage.getItem('current-user');
  return getUser(loggedUserId);
}

export async function getUser(id) {
  const users = await getUsers();
  const user = users[id];
  return user ?? null;
}

export async function updateUser(id, updates) {
  const user = await getUser(id);

  if (!user) {
    throw new Error("No user found for", id);
  }

  const response = await fetch(`${apiHost}/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...user, ...updates, id: user.id, createdAt: user.createdAt }),
  });

  return response.json();
}

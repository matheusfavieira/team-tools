import localforage from "localforage";

const apiHost = import.meta.env.VITE_APP_API_HOST;

export async function getUsers(): Promise<Record<string, User>> {
  const users = await fetch(`${apiHost}/users`, {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }).then((result) => result.json() || []);
  return users;
}

export async function createAndSetLoggedUser(name: string) {
  const user = await createUser(name);
  localforage.setItem("local-user", user);

  return user;
}

export async function createUser(name: string) {
  const localUser = await localforage.getItem("local-user");

  const payload = { ...(localUser ?? {}), name };

  const response = await fetch(`${apiHost}/users`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const user = await response.json();
  return user;
}

export async function getLoggedUser(
  allowCreation = true
): Promise<User | undefined> {
  let loggedUser = await localforage.getItem<User>("local-user");
  let name = loggedUser?.name ?? null;

  if (!loggedUser) {
    if (!allowCreation) {
      return;
    }

    name = prompt("Tell us your name:");

    if (!name) {
      return;
    }

    return createAndSetLoggedUser(name);
  }

  const user = await getUser(loggedUser.id);

  if (!user) {
    return createAndSetLoggedUser(loggedUser.name);
  }

  return user;
}

export async function getUser(id: string) {
  const users = await getUsers();
  const user = users[id];
  return user ?? null;
}

export async function updateUser(id: string, updates: Partial<User>) {
  const user = await getUser(id);

  if (!user) {
    throw new Error(`No user found for ${id}`);
  }

  const response = await fetch(`${apiHost}/users`, {
    method: "PATCH",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      ...user,
      ...updates,
      id: user.id,
    }),
  });

  return response.json();
}

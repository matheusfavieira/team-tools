export const dataStore: Record<string, Entities.User> = {};

const getByName = (name: string): Entities.User =>
  Object.values(dataStore!).find((user) => user.name === name);

export default class User {
  id: string;

  name: string;

  static create({ name, id }: Partial<Entities.User>) {
    let user = getByName(name!);

    if (user && user.id === id) {
      return user;
    }

    const newId = id ?? Math.random().toString(36).substring(2, 9);

    const newUser = {
      id: newId,
      name,
    };

    dataStore[newId] = newUser;

    return newUser;
  }

  constructor(data: Partial<User>) {
    this.id = data?.id ?? "";
    this.name = data?.name ?? "";

    if (this.user) {
      this.name = this.user.name;
    }
  }

  get user() {
    return dataStore[this.id];
  }

  changeName(name: User["name"]) {
    if (!this.user) {
      return;
    }

    const user = { ...this.user, name };

    dataStore[this.id] = user;

    return user;
  }
}

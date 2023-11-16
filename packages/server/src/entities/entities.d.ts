namespace Entities {
  declare type User = {
    id: string;
    name: string;
  };

  declare type Meeting = {
    id: string;
    userIdAdmin: User.id;
    users: User.id[];
    votes: Record<User.id, string>;
    showVotes: boolean;
  };
}

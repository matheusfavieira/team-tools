export const dataStore: Record<string, Entities.Meeting> = {};

export default class Meeting {
  id: string;

  userIdAdmin: Entities.User["id"];

  users: Entities.User["id"][];

  votes: Record<Entities.User["id"], string>;

  showVotes: boolean;

  static create({ userIdAdmin }: Partial<Entities.Meeting>) {
    const id = Math.random().toString(36).substring(2, 9);

    const meeting = {
      id,
      userIdAdmin: userIdAdmin,
      users: [userIdAdmin],
      votes: {},
      showVotes: false,
    };

    dataStore[id] = meeting;

    return meeting;
  }

  static addUserToMeeting(
    id: Entities.Meeting["id"],
    userId: Entities.User["id"]
  ) {
    const meeting = dataStore[id];

    if (!meeting) {
      return;
    }

    meeting.users = [...new Set([...meeting.users, userId])];

    if (userId !== meeting.userIdAdmin && meeting.users.length === 1) {
      meeting.userIdAdmin = userId;
    }

    dataStore[id] = meeting;

    return meeting;
  }

  static removeUserFromMeeting(
    id: Entities.Meeting["id"],
    userId: Entities.User["id"]
  ) {
    const meeting = dataStore[id];

    if (!meeting) {
      return;
    }

    meeting.users = meeting.users.filter(
      (meetingUserId) => meetingUserId !== userId
    );
    delete meeting.votes[userId];

    if (userId === meeting.userIdAdmin && meeting.users.length) {
      meeting.userIdAdmin = meeting.users[0];
    }

    dataStore[id] = meeting;

    return meeting;
  }

  constructor(data: Partial<Meeting>) {
    this.id = data?.id ?? "";
    this.userIdAdmin = data?.userIdAdmin ?? "";
    this.users = data?.users ?? [];
    this.votes = data?.votes ?? {};
    this.showVotes = data?.showVotes ?? false;

    if (this.meeting) {
      this.id = this.meeting.id;
      this.userIdAdmin = this.meeting.userIdAdmin;
      this.users = this.meeting.users;
      this.votes = this.meeting.votes;
      this.showVotes = this.meeting.showVotes;
    }
  }

  get meeting() {
    return dataStore[this.id];
  }

  addUser(userId: Entities.User["id"]) {
    return Meeting.addUserToMeeting(this.id, userId);
  }

  removeUser(userId: Entities.User["id"]) {
    return Meeting.removeUserFromMeeting(this.id, userId);
  }

  addVote(userId: Entities.User["id"], vote: string) {
    if (!this.meeting) {
      return;
    }

    this.meeting.votes[userId] = vote;

    dataStore[this.id] = this.meeting;

    return this.meeting;
  }

  removeVote(userId: Entities.User["id"]) {
    if (!this.meeting) {
      return;
    }

    delete this.meeting.votes[userId];

    dataStore[this.id] = this.meeting;

    return this.meeting;
  }

  setShowVotes(showVotes: Entities.Meeting["showVotes"]) {
    if (!this.meeting) {
      return;
    }

    this.meeting.showVotes = showVotes;

    dataStore[this.id] = this.meeting;

    return this.meeting;
  }

  resetVotes() {
    if (!this.meeting) {
      return;
    }

    this.meeting.showVotes = false;
    this.meeting.votes = {};

    dataStore[this.id] = this.meeting;

    return this.meeting;
  }
}

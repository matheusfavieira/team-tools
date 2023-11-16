declare interface MeetingParams {
  meetingId: string;
}

declare interface User {
  id: string;
  name: string;
}

declare interface Meeting {
  id: string;
  votes: Record<User.id, string>;
  users: User.id[];
  showVotes: boolean;
  userIdAdmin: User.id;
}

declare interface StoryPointingPointsParams {
  points: string[];
  onVote: CallableFunction;
  userVote: string;
}

declare interface StoryPointingVotesParams {
  users: Record<string, User>;
  meeting: Meeting;
}

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
  showVotes: boolean;
}

declare interface StoryPointingVotesParams {
  users: Record<string, User>;
  meeting: Meeting;
}

declare interface StoryPointingAdminRightsRequestParams {
  userRequestingAdminRights?: User;
  isAdmin: boolean;
  onAllowAdminRights: CallableFunction;
  onDenyAdminRights: CallableFunction;
}

declare interface StoryPointingSettingsParams {
  onRequestAdminRights: CallableFunction;
  isAdmin: boolean;
}

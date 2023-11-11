export const StoryPointingVotes = ({ users, meeting }) => {
  const getSectionTitle = () => (<h3>Users Votes:</h3>);

  if (!meeting.users.length) {
    return (
      <>
        {getSectionTitle()}
        <p>
          <i>No users yet</i>
        </p>
      </>
    )
  }

  return (
    <>
      {getSectionTitle()}
      {meeting.users.map((userId: string) => {
        const meetingUser = users[userId];
        const userVote = meeting.votes[userId];

        return (
          <p key={userId}>
            {meetingUser.name}: {!!userVote ? (meeting.showVotes ? userVote : '###') : ''}
          </p>
        )
      })}
    </>
  );
}
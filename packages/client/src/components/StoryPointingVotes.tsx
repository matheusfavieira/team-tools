import React from 'react';

export const StoryPointingVotes = ({ users, meetingUsers, votes, showVotes }) => {
  return (
    <>
      <h3>Users Votes:</h3>
      {meetingUsers.length ? (
        <>
          {meetingUsers.map(userId => {
            const meetingUser = users[userId];
            const userVote = votes[userId];

            return (
              <p key={userId}>
                {meetingUser.name}: {!!userVote ? (showVotes ? userVote : '###') : ''}
              </p>
            )
          })}
        </>
      ) : (
        <p>
          <i>No users yet</i>
        </p>
      )}
    </>
  );
}
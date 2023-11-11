import { redirect, useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getMeeting } from "../../models/meeting";
import { getLoggedUser, getUsers } from "../../models/user";
import useWebSocket from 'react-use-websocket';
import { StoryPointingPoints } from '../../components/StoryPointingPoints';
import { StoryPointingVotes } from '../../components/StoryPointingVotes';

export async function loader({ params }) {
  const [user, users, meeting] = await Promise.allSettled([
    getLoggedUser(),
    getUsers(),
    getMeeting(params.meetingId),
  ]).then(([user, users, meeting]) => {
    return [user.value, users.value, meeting.value];
  });

  if (!user || !meeting) {
    return redirect("/story-pointing");
  }

  return { user, users, meeting };
}

export default function Meeting() {
  const params = useParams();
  const { user, users: defaultUsers, meeting: defaultMeeting } = useLoaderData();

  const [users, setUsers] = useState(defaultUsers);
  const [meeting, setMeeting] = useState(defaultMeeting);
  const [isOwner, setIsOwner] = useState(user.id === meeting?.createdBy);

  const { sendJsonMessage } = useWebSocket(`${import.meta.env.VITE_APP_SOCKET_HOST}/meeting-votes`, {
    queryParams: {
      userId: user.id,
      meetingId: meeting.id,
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);

      if (data.users) {
        setUsers(data.users);
      }

      if (data.meeting) {
        setMeeting(data.meeting);
      }
    },
  });

  const onVote = (vote) => {
    sendJsonMessage({ action: 'add-vote', vote });
  };

  const onToggleResults = () => {
    const willShowResults = !meeting.showVotes;
    sendJsonMessage({ action: willShowResults ? 'show-votes' : 'hide-votes' });
  };

  const onReset = () => {
    sendJsonMessage({ action: 'reset-votes' });
  };

  useEffect(() => {
    setIsOwner(meeting?.createdBy === user.id);
  }, [meeting.createdBy, user.id])
  
  const availablePoints = import.meta.env.VITE_APP_STORY_POINTING_OPTIONS?.split(',') ?? ['0', '0.5', '1', '2', '3', '5', '8', '?'];

  return (
    <>
      <h1>Meeting ID: {params.meetingId}</h1>

      <h2>User: {user.name}</h2>

      <StoryPointingPoints points={availablePoints} onVote={onVote} userVote={meeting.votes?.[user.id]} />

      <StoryPointingVotes meeting={meeting} users={users} />

      {isOwner && (
        <>
          <button type="button" onClick={onToggleResults}>
            {meeting?.showVotes ? 'Hide Votes' : 'Show Votes'}
          </button>
    
          <button type="button" onClick={onReset}>
            Reset
          </button>
        </>  
      )}
    </>
  );
}
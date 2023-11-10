import { useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getMeeting } from "../../models/meeting";
import { getLoggedUser, getUsers } from "../../models/user";
import useWebSocket from 'react-use-websocket';
import { StoryPointingAdminControllers } from '../../components/StoryPointingAdminControllers';
import { StoryPointingPoints } from '../../components/StoryPointingPoints';
import { StoryPointingVotes } from '../../components/StoryPointingVotes';

export async function loader({ params }) {
  const user = await getLoggedUser();
  const users = await getUsers();
  const meeting = await getMeeting(params.meetingId);

  return { user, users, meeting };
}

export default function Meeting() {
  const params = useParams();
  const { user, users: defaultUsers, meeting: defaultMeeting } = useLoaderData();

  const [users, setUsers] = useState(defaultUsers);
  const [meeting, setMeeting] = useState(defaultMeeting);

  const [availablePoints, setAvailablePoints] = useState(meeting.availablePoints);
  const [isOwner, setIsOwner] = useState(user.id === meeting.createdBy);
  const [showVotes, setShowVotes] = useState(meeting.showVotes);

  const { sendJsonMessage } = useWebSocket(`ws://localhost:3000/meeting-votes`, {
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
        setAvailablePoints(data.meeting.availablePoints);
        setShowVotes(data.meeting.showVotes);
      }
    },
  });

  const onVote = (vote) => {
    setMeeting({...meeting, votes: {...meeting.votes, [user.id]: vote }});
    sendJsonMessage({ action: 'add-vote', vote });
  };

  const onToggleResults = () => {
    const willShowResults = !showVotes;
    setShowVotes(willShowResults);
    sendJsonMessage({ action: willShowResults ? 'show-votes' : 'hide-votes' });
  };

  const onReset = () => {
    setShowVotes(false);
    setMeeting({...meeting, votes: {}, showVotes: false });
    sendJsonMessage({ action: 'reset-votes' });
  };

  useEffect(() => {
    setIsOwner(meeting?.createdBy === user.id);
  }, [meeting.createdBy, user.id])

  return (
    <>
      <h1>Meeting ID: {params.meetingId}</h1>

      <h2>User: {user.name}</h2>

      {availablePoints.length && (<StoryPointingPoints points={availablePoints} onVote={onVote} userVote={meeting?.votes?.[user.id]} />)}

      <StoryPointingVotes meetingUsers={meeting.users} users={users} votes={meeting.votes} showVotes={showVotes} />

      {isOwner && (<StoryPointingAdminControllers showVotes={showVotes} onToggleResults={onToggleResults} onReset={onReset} />)}
    </>
  );
}
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { getMeeting } from "../../models/meeting";
import { getLoggedUser, getUsers } from "../../models/user";
import useWebSocket from "react-use-websocket";
import { StoryPointingPoints } from "../../components/StoryPointingPoints";
import { StoryPointingVotes } from "../../components/StoryPointingVotes";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import StoryPointingSettings from "../../components/StoryPointingSettings";
import StoryPointingAdminRightsRequest from "../../components/StoryPointingAdminRightsRequest";

type LoaderResults = {
  user: User;
  users: Record<string, User>;
  meeting: Meeting;
};

export async function loader({ params }: LoaderFunctionArgs<MeetingParams>) {
  if (!params.meetingId) {
    return redirect("/story-pointing");
  }

  const [user, users, meeting] = await Promise.all([
    getLoggedUser(),
    getUsers(),
    getMeeting(params.meetingId!),
  ]);

  if (!user || !meeting) {
    return redirect("/story-pointing");
  }

  return { user, users, meeting } as LoaderResults;
}

export default function Meeting() {
  const params = useParams();
  const {
    user,
    users: defaultUsers,
    meeting: defaultMeeting,
  } = useLoaderData() as LoaderResults;

  const [userRequestingAdminRights, setUserRequestingAdminRights] = useState();

  const [users, setUsers] = useState(defaultUsers);
  const [meeting, setMeeting] = useState(defaultMeeting);
  const [isAdmin, setIsAdmin] = useState(user.id === meeting?.userIdAdmin);

  const { sendJsonMessage } = useWebSocket(
    `${import.meta.env.VITE_APP_WEBSOCKET_HOST}/meeting-votes`,
    {
      queryParams: {
        userId: user.id,
        meetingId: meeting.id,
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.action === "request-admin-rights" && isAdmin) {
          setUserRequestingAdminRights(data.user);
        }

        if (data.users) {
          setUsers(data.users);
        }

        if (data.meeting) {
          setMeeting(data.meeting);
        }
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      heartbeat: {
        message: "ping",
        returnMessage: "pong",
        timeout: 60000, // 1 minute, if no response is received, the connection will be closed
        interval: 15000, // every 15 seconds, a ping message will be sent
      },
    }
  );

  const onVote = (vote: string) => {
    sendJsonMessage({ action: "add-vote", vote });
  };

  const onToggleResults = () => {
    const willShowResults = !meeting.showVotes;
    sendJsonMessage({ action: willShowResults ? "show-votes" : "hide-votes" });
  };

  const onReset = () => {
    sendJsonMessage({ action: "reset-votes" });
  };

  const onRequestAdminRights = () => {
    sendJsonMessage({ action: "request-admin-rights" });
  };

  const onDenyAdminRights = () => {
    sendJsonMessage({
      action: "deny-admin-rights",
      user: userRequestingAdminRights,
    });
    setUserRequestingAdminRights(undefined);
  };

  const onAllowAdminRights = () => {
    sendJsonMessage({
      action: "allow-admin-rights",
      user: userRequestingAdminRights,
    });
    setUserRequestingAdminRights(undefined);
  };

  useEffect(() => {
    setIsAdmin(meeting?.userIdAdmin === user.id);
  }, [meeting.userIdAdmin, user.id]);

  const availablePoints =
    import.meta.env.VITE_APP_STORY_POINTING_OPTIONS?.split(",") ?? [
      "0",
      "0.5",
      "1",
      "2",
      "3",
      "5",
      "8",
      "?",
    ];

  return (
    <Box>
      <h1>Meeting ID: {params.meetingId}</h1>

      <h2>User: {user.name}</h2>

      <StoryPointingPoints
        points={availablePoints}
        showVotes={meeting.showVotes}
        onVote={onVote}
        userVote={meeting.votes?.[user.id]}
      />

      <Box component="main" sx={{ width: "fit-content" }}>
        <StoryPointingVotes meeting={meeting} users={users} />

        {isAdmin && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="success"
              type="button"
              onClick={onToggleResults}
            >
              {meeting.showVotes ? "Hide Votes" : "Show Votes"}
            </Button>

            <Button
              variant="outlined"
              color="warning"
              type="button"
              onClick={onReset}
            >
              Reset
            </Button>
          </Box>
        )}
      </Box>

      <StoryPointingAdminRightsRequest
        userRequestingAdminRights={userRequestingAdminRights}
        isAdmin={isAdmin}
        onAllowAdminRights={onAllowAdminRights}
        onDenyAdminRights={onDenyAdminRights}
      />

      <StoryPointingSettings
        onRequestAdminRights={onRequestAdminRights}
        isAdmin={isAdmin}
      />
    </Box>
  );
}

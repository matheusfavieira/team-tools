import User, { dataStore as userStore } from "./src/entities/User";
import Meeting, { dataStore as meetingStore } from "./src/entities/Meeting";

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": Bun.env.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "OPTIONS, POST, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};

const generateSocketPayload = ({ action, meeting, user }) => ({
  action,
  users: userStore,
  meeting,
  user,
});

const publishMessage = (server, meetingId, payload) => {
  const meetingRoom = `meeting-${meetingId}`;
  server.publish(meetingRoom, JSON.stringify(payload));
};

const server = Bun.serve<{ user: Entities.User; meeting: Entities.Meeting }>({
  async fetch(req, server) {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      const res = new Response("Departed", CORS_HEADERS);
      return res;
    }

    const url = new URL(req.url);

    if (url.pathname === "/users") {
      if (req.method === "POST") {
        const body = await req.json();

        const user = User.create({ name: body.name, id: body.id });

        return new Response(JSON.stringify(user), CORS_HEADERS);
      }

      if (req.method === "PATCH") {
        const body = await req.json();

        const user = new User({ id: body.id });
        user.changeName(body.name);

        return new Response(JSON.stringify(user.user), CORS_HEADERS);
      }

      return new Response(JSON.stringify(userStore), CORS_HEADERS);
    }

    if (url.pathname === "/meetings") {
      if (req.method === "POST") {
        const body = await req.json();

        const meeting = Meeting.create({ userIdAdmin: body.userIdAdmin });

        return new Response(JSON.stringify(meeting), CORS_HEADERS);
      }

      return new Response(JSON.stringify(meetingStore), CORS_HEADERS);
    }

    if (url.pathname === "/meeting-votes") {
      const userId = url.searchParams.get("userId")!;
      const meetingId = url.searchParams.get("meetingId")!;

      const user = userStore[userId];
      const meeting = meetingStore[meetingId];

      const success = server.upgrade(req, { data: { user, meeting } });
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    return new Response(JSON.stringify({ Hello: "World!" }), CORS_HEADERS);
  },
  websocket: {
    open(ws) {
      const meetingRoom = `meeting-${ws.data.meeting.id}`;

      const meeting = Meeting.addUserToMeeting(
        ws.data.meeting.id,
        ws.data.user.id
      );
      const payload = generateSocketPayload({ action: "join", meeting });

      ws.subscribe(meetingRoom);
      server.publish(meetingRoom, JSON.stringify(payload));
    },

    close(ws) {
      const meetingRoom = `meeting-${ws.data.meeting.id}`;

      const meeting = Meeting.removeUserFromMeeting(
        ws.data.meeting.id,
        ws.data.user.id
      );
      const payload = generateSocketPayload({ action: "leave", meeting });

      server.publish(meetingRoom, JSON.stringify(payload));
      ws.unsubscribe(meetingRoom);
    },

    message(ws, message) {
      const options = JSON.parse(message);

      const meetingId = ws.data.meeting.id;
      const userId = ws.data.user.id;

      const meeting = new Meeting({ id: meetingId });

      if (options.action === "request-admin-rights") {
        const payload = generateSocketPayload({
          action: options.action,
          meeting: meeting.meeting,
          user: userStore[userId],
        });

        publishMessage(server, meetingId, payload);
        return;
      }

      if (options.action === "deny-admin-rights") {
        const payload = generateSocketPayload({
          action: options.action,
          meeting: meeting.meeting,
          user: options.user,
        });

        publishMessage(server, meetingId, payload);
        return;
      }

      switch (options.action) {
        case "add-vote":
          meeting.addVote(userId, options.vote);
          break;

        case "remove-vote":
          meeting.removeVote(userId);
          break;

        case "show-votes":
          meeting.setShowVotes(true);
          break;

        case "hide-votes":
          meeting.setShowVotes(false);
          break;

        case "reset-votes":
          meeting.resetVotes();
          break;

        case "allow-admin-rights":
          meeting.changeAdmin(options.user.id);
          break;

        case "loaded":
        default:
          break;
      }

      const payload = generateSocketPayload({
        action: options.action,
        meeting: meeting.meeting,
      });

      publishMessage(server, meetingId, payload);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

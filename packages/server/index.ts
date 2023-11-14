const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": Bun.env.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "OPTIONS, POST, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};

const database = {
  users: {},
  meetings: {},
};

const server = Bun.serve<{ user: string; meeting: string }>({
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

        const id = Math.random().toString(36).substring(2, 9);
        const user = { id, createdAt: Date.now(), name: body.name };

        database.users[id] = user;

        return new Response(JSON.stringify(database.users[id]), CORS_HEADERS);
      }

      if (req.method === "PATCH") {
        const body = await req.json();

        const updates = { name: body.name };

        database.users[body.id] = { ...database.users[body.id], ...updates };

        return new Response(
          JSON.stringify(database.users[body.id]),
          CORS_HEADERS
        );
      }

      return new Response(JSON.stringify(database.users), CORS_HEADERS);
    }

    if (url.pathname === "/meetings") {
      if (req.method === "POST") {
        const body = await req.json();

        const id = Math.random().toString(36).substring(2, 9);

        const meeting = {
          id,
          createdBy: body.createdBy,
          users: [body.createdBy],
          votes: {},
          showVotes: false,
        };

        database.meetings[id] = meeting;

        return new Response(
          JSON.stringify(database.meetings[id]),
          CORS_HEADERS
        );
      }

      if (req.method === "PATCH") {
        const body = await req.json();

        const updates = { name: body.name };

        database.meetings[id] = { ...database.meetings[id], ...updates };

        return new Response(
          JSON.stringify(database.meetings[id]),
          CORS_HEADERS
        );
      }

      return new Response(JSON.stringify(database.meetings), CORS_HEADERS);
    }

    if (url.pathname === "/meeting-votes") {
      const userId = url.searchParams.get("userId");
      const meetingId = url.searchParams.get("meetingId");

      const user = database.users[userId];
      const meeting = database.meetings[meetingId];

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

      database.meetings[ws.data.meeting.id].users = [
        ...new Set([
          ...database.meetings[ws.data.meeting.id].users,
          ws.data.user.id,
        ]),
      ];

      const payload = {
        action: "join",
        user: ws.data.user,
        users: database.users,
        meeting: database.meetings[ws.data.meeting.id],
      };

      ws.subscribe(meetingRoom);
      server.publish(meetingRoom, JSON.stringify(payload));
    },

    close(ws) {
      const meetingRoom = `meeting-${ws.data.meeting.id}`;

      if (database.meetings?.[ws.data.meeting.id]) {
        const meeting = database.meetings[ws.data.meeting.id];
        meeting.users = meeting.users.filter(
          (userId) => userId !== ws.data.user.id
        );
        delete meeting.votes[ws.data.user.id];

        if (ws.data.user.id === meeting.createdBy && meeting.users.length) {
          meeting.createdBy = meeting.users[0];
        }
      }

      const payload = {
        action: "leave",
        user: ws.data.user,
        users: database.users,
        meeting: database.meetings?.[ws.data.meeting.id],
      };

      server.publish(meetingRoom, JSON.stringify(payload));
      ws.unsubscribe(meetingRoom);
    },

    message(ws, message) {
      const options = JSON.parse(message);

      const meeting = database.meetings[ws.data.meeting.id];

      switch (options.action) {
        case "add-vote":
          meeting.votes[ws.data.user.id] = options.vote;
          break;

        case "remove-vote":
          delete meeting.votes[ws.data.user.id];
          break;

        case "show-votes":
          meeting.showVotes = true;
          break;

        case "hide-votes":
          meeting.showVotes = false;
          break;

        case "reset-votes":
          meeting.showVotes = false;
          meeting.votes = {};
          break;

        case "loaded":
        default:
          break;
      }

      const meetingRoom = `meeting-${ws.data.meeting.id}`;

      const payload = {
        action: options.action,
        user: ws.data.user,
        users: database.users,
        meeting,
      };

      server.publish(meetingRoom, JSON.stringify(payload));
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

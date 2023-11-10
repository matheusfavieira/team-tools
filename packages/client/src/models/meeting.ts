const apiHost = 'http://localhost:3000';

export async function getMeetings() {
  const meetings = await fetch(`${apiHost}/meetings`).then(result => result.json() || []);
  return meetings;
}

export async function createMeeting(createdBy) {
  const response = await fetch(`${apiHost}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ createdBy }),
  });

  const meeting = await response.json();
  return meeting;
}

export async function getMeeting(id) {
  const meetings = await getMeetings();
  const meeting = meetings[id];
  return meeting ?? null;
}

export async function updateMeeting(id, updates) {
  const meeting = await getMeeting(id);

  if (!meeting) {
    throw new Error("No meeting found for", id);
  }

  const response = await fetch(`${apiHost}/meetings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...meeting, ...updates, id: meeting.id, createdAt: meeting.createdAt }),
  });

  return response.json();
}

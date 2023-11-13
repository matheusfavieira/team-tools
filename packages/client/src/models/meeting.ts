const apiHost = import.meta.env.VITE_APP_API_HOST;

export async function getMeetings(): Promise<Record<string, Meeting>> {
  const meetings = await fetch(`${apiHost}/meetings`, {
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  }).then((result) => result.json() || []);
  return meetings;
}

export async function createMeeting(createdBy: string) {
  const response = await fetch(`${apiHost}/meetings`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    }),
    body: JSON.stringify({ createdBy }),
  });

  const meeting = await response.json();
  return meeting;
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
  const meetings = await getMeetings();
  const meeting = meetings[id];
  return meeting;
}

export async function updateMeeting(id: string, updates: Partial<Meeting>) {
  const meeting = await getMeeting(id);

  if (!meeting) {
    throw new Error(`No meeting found for ${id}`);
  }

  const response = await fetch(`${apiHost}/meetings`, {
    method: "PATCH",
    headers: new Headers({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    }),
    body: JSON.stringify({
      ...meeting,
      ...updates,
      id: meeting.id,
    }),
  });

  return response.json();
}

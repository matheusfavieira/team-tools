import { Form, redirect, useLoaderData } from "react-router-dom";
import { createMeeting } from "../../models/meeting";
import {
  createAndSetLoggedUser,
  getLoggedUser,
  updateUser,
} from "../../models/user";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export async function action({ request }) {
  let formData = await request.formData();
  let meetingId = formData.get("meetingId");
  let name = formData.get("name");
  let userId = formData.get("userId");

  if (name) {
    if (userId) {
      return updateUser(userId, { name: name });
    } else {
      return createAndSetLoggedUser(name);
    }
  }

  if (!meetingId) {
    const meeting = await createMeeting(userId);
    meetingId = meeting.id;
  }

  return redirect(meetingId);
}

export async function loader() {
  const user = await getLoggedUser(false);
  return { user };
}

export default function Index() {
  const { user } = useLoaderData();

  return (
    <>
      <h1>Story Pointing:</h1>

      <div>
        <Form method="post">
          <input name="userId" type="hidden" value={user?.id} />
          <div>
            <TextField
              id="name"
              name="name"
              label="Name"
              placeholder="John Doe"
              defaultValue={user?.name}
              variant="outlined"
              size="small"
            />
            <Button variant="contained" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>

      <br />

      {!!user && (
        <div>
          <Form method="post">
            <input name="userId" type="hidden" value={user?.id} />
            <Button variant="contained" type="submit" disabled={!user?.id}>
              New meeting
            </Button>
          </Form>

          <p>or</p>

          <Form method="post">
            <TextField
              id="meetingId"
              name="meetingId"
              label="Meeting #"
              variant="outlined"
              size="small"
            />
            <Button variant="contained" type="submit" disabled={!user?.id}>
              Join meeting
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}

import {
  ActionFunctionArgs,
  Form,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { createMeeting } from "../../models/meeting";
import {
  createAndSetLoggedUser,
  getLoggedUser,
  updateUser,
} from "../../models/user";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import LoginIcon from "@mui/icons-material/Login";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let meetingId = formData.get("meetingId") as string;
  let name = formData.get("name") as string;
  let userId = formData.get("userId") as string;

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
  const { user } = useLoaderData() as { user: User };

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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" color="primary" type="submit">
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" color="primary" type="submit">
                      <LoginIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Form>
        </div>
      )}
    </>
  );
}

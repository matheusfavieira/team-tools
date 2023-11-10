import { Form, redirect, useLoaderData } from "react-router-dom";
import { createMeeting } from "../../models/meeting";
import { createAndSetLoggedUser, getLoggedUser, updateUser } from "../../models/user";

export async function action({ request }) {
  let formData = await request.formData();
  let meetingId = formData.get('meetingId');
  let userName = formData.get('userName');
  let userId = formData.get('userId');

  if (userName) {
    if (userId) {
      return updateUser(userId, { name: userName });
    } else {
      return createAndSetLoggedUser(userName);
    }
  }

  if (!meetingId) {
    const meeting = await createMeeting(userId);
    meetingId = meeting.id;
  }

  return redirect(meetingId);
}

export async function loader() {
  const user = await getLoggedUser();
  return { user };
}

export default function Index() {
  const { user } = useLoaderData();

  return (
    <>
      <h1>Story Pointing:</h1>

      <div>
        <Form method="post">
          <legend>Tell us your name:</legend>
          <input name="userId" type="hidden" value={user?.id} />
          <div>
            <input name="userName" id="userName" placeholder="John Doe" defaultValue={user?.name} />
            <button type="submit">Save</button>
          </div>
        </Form>
      </div>

      <br />

      {!!user && (<div>
          <Form method="post">
          <input name="userId" type="hidden" value={user?.id} />
          <button type="submit" disabled={!user?.id}>New meeting</button>
        </Form>

        <p>or</p>

        <Form method="post">
          <input name="meetingId" placeholder="Meeting #" />
          <button type="submit" disabled={!user?.id}>Join meeting</button>
        </Form>
      </div>)}
    </>
  );
}
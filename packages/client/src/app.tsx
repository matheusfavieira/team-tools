import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Template from "./template";
import ErrorPage from "./error-page";

import Home from "./routes/home";

import StoryPointingIndex, {
  action as storyPointingAction,
  loader as storyPointingLoader,
} from "./routes/story-pointing/index";
import StoryPointingMeeting, {
  loader as storyPointingMeetingLoader,
} from "./routes/story-pointing/meeting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "story-pointing",
            action: storyPointingAction,
            loader: storyPointingLoader,
            element: <StoryPointingIndex />,
          },
          {
            path: "story-pointing/:meetingId",
            loader: storyPointingMeetingLoader,
            element: <StoryPointingMeeting />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

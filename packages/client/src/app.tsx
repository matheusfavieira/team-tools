import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MoodMeter from "./routes/mood-meter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    errorElement: <ErrorPage />,
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
          {
            path: "mood-meter/",
            element: <MoodMeter />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

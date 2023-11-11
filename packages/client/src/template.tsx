import { useEffect } from "react";
import { Outlet, NavLink, useNavigation } from "react-router-dom";

export default function Template() {
  const navigation = useNavigation();

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE;
  }, []);

  return (
    <>
      <div id="sidebar">
        <h1><NavLink to="/">{import.meta.env.VITE_APP_TITLE}</NavLink></h1>

        <nav>
            <ul>
                <li key="story-pointing">
                  <NavLink
                    to={`story-pointing`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    Story Pointing
                  </NavLink>
                </li>
            </ul>
        </nav>
      </div>

      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}

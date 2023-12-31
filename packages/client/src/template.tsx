import { Outlet, NavLink, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import Container from "@mui/material/Container";
import { DonationButton } from "./components/DonateButton";

const drawerWidth = 240;
const navItems = [
  { label: "Story Pointing", url: "/story-pointing" },
  { label: "Mood Meter", url: "/mood-meter" },
];

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE;
  }, []);

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <List>
        <ListItem key={"/"} disablePadding>
          <ListItemButton
            sx={{ textAlign: "center" }}
            component={NavLink}
            to={"/"}
          >
            <ListItemText primary={import.meta.env.VITE_APP_TITLE} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.url} disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                component={NavLink}
                to={item.url}
                selected={pathname === item.url}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ marginTop: "auto", marginBottom: 2 }}>
        <DonationButton />
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Button sx={{ color: "#fff" }} component={NavLink} to={"/"}>
              {import.meta.env.VITE_APP_TITLE}
            </Button>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.url}
                sx={{ color: "#fff" }}
                component={NavLink}
                to={item.url}
              >
                {item.label}
              </Button>
            ))}

            <DonationButton />
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
        <Toolbar />
        <Outlet />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box component="footer" sx={{ marginTop: "auto", marginBottom: 1 }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            {new Date().getFullYear()} built by Matt Vieira
          </Typography>

          <Box>
            <IconButton
              href="https://github.com/matheusfavieira"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

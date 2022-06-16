import Link from "next/link";

import { useState, useEffect, useContext, useMemo } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import LinearProgress from "@mui/material/LinearProgress";
import MuiAppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAdd from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LoginIcon from "@mui/icons-material/Login";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

import Footer from "@/components/Footer";

import ContextColor from "@/context/color";

const drawerWidth = 240;
const drawerNavigation = [
  { text: "Dashboard", icon: <DashboardIcon />, link: "/admin" },
  { text: "Projects", icon: <GridViewRoundedIcon />, link: "/admin/projects" },
  // { text: 'Task', icon: (<AssignmentIcon />), link: "/admin/task" },
  // { text: 'Attendance', icon: (<AssignmentIcon />), link: "/admin/task" },
  { text: "Team", icon: <PersonIcon />, link: "/admin/team" },
  { text: "Roles", icon: <WorkspacesIcon />, link: "/admin/roles" },
  { text: "Members", icon: <GroupIcon />, link: "/admin/members" },
  // { text: "Sign In", icon: <LoginIcon />, link: "/admin/signin" },
  // { text: "Sign Up", icon: <AssignmentIndIcon />, link: "/admin/signup" },
];
const menuPrimary = [];
const menuSecondary = [
  { text: "Setting", icon: <SettingsIcon />, link: "/admin/members" },
  { text: "Logout", icon: <LogoutIcon />, link: "/admin/members" },
];

const Section = styled("section", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const mdUp = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.md));
  if (mdUp) {
    return {
      display: "flex",
      flexFlow: "column",
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    };
  } else {
    return {
      display: "flex",
      flexFlow: "column",
      flexGrow: 1,
    };
  }
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const mdUp = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.md));
  if (mdUp) {
    return {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    };
  } else {
    return {};
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  ...theme.mixins.toolbar,
  justifyContent: "center",
}));

export default function Admin(props) {
  const appName = process.env.NEXT_PUBLIC_WEB_NAME;
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.md));
  const colorMode = useContext(ContextColor);
  const [loaderProgress, setLoaderProgress] = useState({
    show: props.loaderProgress?.show ?? false,
    backdrop: props.loaderProgress?.backdrop ?? false,
    variant: "indeterminate",
    progress: 100,
  });
  const [anchorMenu, setAnchoMenu] = useState(null);
  const [openDrawer, setDrawerOpen] = useState(true);
  const handleDrawer = () => {
    setDrawerOpen(!openDrawer);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleMenu = (event) => {
    setAnchoMenu(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchoMenu(null);
  };
  const handleRouteChangeStart = () => {
    setLoaderProgress((prev) => ({ ...prev, show: true, backdrop: true }));
  };
  const handleRouteChangeComplete = () => {
    setLoaderProgress((prev) => ({ ...prev, show: false, backdrop: false }));
  };
  useEffect(() => {
    setDrawerOpen(mdUp);
  }, [mdUp]);
  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    // return () => {
    //   router.events.off("routeChangeStart", handleRouteChangeStart);
    //   router.events.off("routeChangeComplete", handleRouteChangeComplete);
    // };
  }, []);
  useEffect(() => {
    setLoaderProgress((prev) => Object.assign(prev, props.loaderProgress));
  });

  return (
    <Box display={"grid"} sx={{ maxWidth: "100vw", minHeight: "100vh" }}>
      <Box display={"flex"}>
        <AppBar open={openDrawer} variant="outlined" elevation={0}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawer}
            >
              {openDrawer ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {props.pageTitle}
            </Typography>
            <div>
              <Tooltip title={`Theme Mode ${theme.palette.mode}`}>
                <IconButton
                  size="large"
                  aria-label="theme mode"
                  onClick={colorMode.toggleMode}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <LightModeRoundedIcon />
                  ) : (
                    <DarkModeRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  aria-label="Notifications"
                  color="inherit"
                  // onClick={colorMode.toggleMode}
                >
                  <NotificationsIcon></NotificationsIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Account">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                open={!!anchorMenu}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                disableScrollLock={true}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                {/* <MenuItem>
                  <Avatar /> My account
                </MenuItem> */}
                <Divider />
                {menuSecondary.map((item) => (
                  <MenuItem key={item.text}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </MenuItem>
                ))}

                {/* <MenuItem>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem> */}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant={mdUp ? "persistent" : "temporary"}
          anchor="left"
          onClose={handleDrawerClose}
          open={openDrawer}
        >
          <Divider />
          <DrawerHeader>
            <Toolbar>
              <Avatar alt="GIS" src="/proto-512.v2.svg" variant="rounded" />
              <Typography variant="h6" component="div" href="/" marginX="1rem">
                {appName}
              </Typography>
            </Toolbar>
          </DrawerHeader>
          <Divider />
          <List>
            {drawerNavigation.map(({ text, icon, link }, index) => (
              <ListItem key={text} disablePadding>
                <Link style={{ all: "inherit" }} href={link}>
                  <ListItemButton selected={props.pageTitle === text}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          {/* <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Drawer>
        <Section open={openDrawer}>
          <DrawerHeader></DrawerHeader>
          <Box component="main" flexGrow="1">
            {loaderProgress.show && (
              <>
                <LinearProgress
                  color="secondary"
                  variant={loaderProgress.variant}
                  value={loaderProgress.progress}
                  sx={{
                    position: "fixed",
                    height: "6px",
                    width: "100%",
                    zIndex: "1000",
                  }}
                />
                <Backdrop
                  open={loaderProgress.backdrop}
                  sx={{
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.15)",
                    zIndex: "1500",
                  }}
                ></Backdrop>
              </>
            )}
            {props.children}
          </Box>
          <Footer></Footer>
        </Section>
      </Box>
    </Box>
  );
}

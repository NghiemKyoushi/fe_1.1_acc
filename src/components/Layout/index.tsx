"use client";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SideNavItem from "./SideNavItem";
import { Stack, SvgIcon } from "@mui/material";
import { items } from "./config";
import { usePathname } from "next/navigation";
import WithAuthGuard from "@/hocs/WithAuth";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { cookieSetting } from "@/utils";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/actions";

const drawerWidth: number = 200;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    backgroundColor: "#393A3D",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface DashboardProps {
  children: React.ReactNode;
}
const defaultTheme = createTheme();

export default function Dashboard(props: DashboardProps) {
  const { children } = props;
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = React.useState<string | undefined>("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Kiểm tra giá trị từ cookies và cập nhật nếu cần
    const roles = cookieSetting.get("roles");
    setRole(roles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieSetting.get("roles")]);

  const handleSignOut = async () => {
    dispatch(logout());
    Cookies.set("token", "", { expires: new Date(2000, 0, 1) });
    Cookies.remove("userName");
    Cookies.remove("employeeId");
    Cookies.remove("roles");
    Cookies.remove("branchName");
    Cookies.remove("branchCode");
    Cookies.remove("branchId");
    router.push("/auth/login");
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <WithAuthGuard>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar color="transparent" position="absolute" open={open}></AppBar>
          <Drawer
            style={{ backgroundColor: "#393A3D" }}
            variant="permanent"
            open={open}
          >
            <Toolbar
              sx={{
                backgroundColor: "#393A3D",
                display: "flex",
                alignItems: "center",
                justifyContent: !open ? "center" : "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                {open ? (
                  <ChevronLeftIcon style={{ color: "#fff" }} />
                ) : (
                  <ChevronRightIcon style={{ color: "#fff" }} />
                )}
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <Stack
                component="ul"
                spacing={0.5}
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                }}
              >
                {items.map<React.ReactNode>((item, index) => {
                  const active = item.path ? pathname === item.path : false;
                  let hasAccess = false;
                  if (role) {
                    hasAccess = !item.roles || item.roles?.includes(role);
                  }
                  if (item.path === "/auth/login") {
                    return (
                      <SideNavItem
                        onClickIcon={handleSignOut}
                        open={open}
                        active={active}
                        disabled={item.disabled}
                        // external={item.external}
                        icon={item.icon}
                        key={index}
                        path={""}
                        title={item.title}
                      />
                    );
                  }
                  if (hasAccess) {
                    return (
                      <SideNavItem
                        open={open}
                        active={active}
                        disabled={item.disabled}
                        // external={item.external}
                        icon={item.icon}
                        key={index}
                        path={item.path}
                        title={item.title}
                      />
                    );
                  } else {
                    return <div key={item.title}></div>;
                  }
                })}
              </Stack>
              <Stack
                component="ul"
                spacing={0.5}
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                }}
              ></Stack>
              <Divider sx={{ my: 1 }} />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              maxWidth: "100%",
            }}
          >
            <Toolbar />
            <Container maxWidth="xl">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 650,
                    }}
                  >
                    {children}
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </WithAuthGuard>
  );
}

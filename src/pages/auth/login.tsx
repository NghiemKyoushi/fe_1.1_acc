import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "@/store/auth/actions";
import { useRouter } from "next/router";
import { RootState } from "@/reducers/rootReducer";
import { cookieSetting } from "@/utils";
import Cookies from "js-cookie";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  // const token = useSelector((state: RootState) => state.auth.token);
  // const userName = useSelector((state: RootState) => state.auth.userName);
  // const branchId = useSelector((state: RootState) => state.auth.branchId);
  // const employeeId = useSelector((state: RootState) => state.auth.employeeId);
  // const roles = useSelector((state: RootState) => state.auth.roles);
  // const branchName = useSelector((state: RootState) => state.auth.branchName);
  // const branch = useSelector((state: RootState) => state.auth.branch);
  // console.log("selector", token);
  const tokenCookie = Cookies.get("token");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const callback = (data: any) => {
    router.push("/invoiceManagement");
    console.log("Inside callback after login");
  };
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password } = getValues();
    dispatch(
      loginRequest({
        values: { email: email, password: password },
        callback,
      })
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <form onSubmit={onSubmitForm} style={{ marginTop: 1 }}>
            <TextField
              margin="normal"
              required={true}
              fullWidth
              {...register("email", { required: true })}
              id="email"
              label="Tên đăng nhập"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              {...register("password", { required: true })}
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

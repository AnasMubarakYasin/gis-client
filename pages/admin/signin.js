import { useEffect, useState } from "react";
import { styled, useTheme, useMediaQuery } from "@mui/material";
// @ts-ignore
import { Formik, Form, Field } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MUILink from "@mui/material/Link";

// import Input from '@mui/material/Input';
// import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import LayoutPage from "@/layout/Page";
import { useSigninMutation } from "@/store/members";
// import { login } from "@/store/account";
import { login } from "@/store/user";

// @ts-ignore
function PageSignin(props) {
  const router = useRouter();
  const theme = useTheme();
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // @ts-ignore
  const [signin, { data, error, isLoading, isSuccess, isError }] =
    useSigninMutation();
  const sm_up = useMediaQuery(
    theme.breakpoints.up(theme.breakpoints.values.sm)
  );
  // @ts-ignore
  const [values, setValues] = useState({
    name: "",
    password: "",
  });
  const [pass, setPass] = useState({
    amount: "",
    weight: "",
    weightRange: "",
    show: false,
  });
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });
  const handleClickShowPassword = () => {
    setPass({
      ...pass,
      show: !pass.show,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleSubmit = (values, { setSubmitting }) => {
    signin({ data: values })
      .unwrap()
      // @ts-ignore
      .catch((reason) => {
        setSubmitting(false);
      });
  };
  const handleCloseSnack = () => {
    setSnack({
      open: false,
      id: 100,
      timeout: 5000,
      message: <div></div>,
      vertical: "bottom",
      horizontal: "center",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        login({ account: data.user, token: data.token, remember: true })
      );
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Sign In.
          </Alert>
        ),
      }));
      router.push("/admin/dashboard");
    }
    if (isError) {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              error.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [isSuccess, isError]);

  return (
    <LayoutPage animate>
      <Box
        display="grid"
        sx={{
          maxWidth: "100vw",
          minHeight: "100vh",
          placeContent: {
            xs: "center stretch",
            sm: "center",
          },
          background: {
            xs: theme.palette.background.paper,
            sm: theme.palette.background.default,
          },
        }}
      >
        <Formik initialValues={values} onSubmit={handleSubmit}>
          {({ values, errors, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Paper
                elevation={0}
                variant={sm_up ? "outlined" : "elevation"}
                sx={{
                  display: "grid",
                  background: theme.palette.background.paper,
                  width: {
                    xs: "100%",
                    sm: "460px",
                  },
                  padding: {
                    xs: "16px",
                    sm: "32px",
                  },
                  gap: {
                    xs: "24px",
                    sm: "44px",
                  },
                }}
              >
                <Box display="grid" sx={{ placeItems: "center" }}>
                  <Typography
                    fontWeight={theme.typography.fontWeightBold}
                    fontSize="1.8rem"
                  >
                    Login to Account
                  </Typography>
                  <Typography variant="subtitle1">
                    Please enter your username and password to continue
                  </Typography>
                </Box>
                <Box display="grid" gap="16px">
                  <TextField
                    autoFocus
                    required
                    label="Username"
                    name="name"
                    type="text"
                    autoComplete="username"
                    value={values.name}
                    error={!!errors.name}
                    // @ts-ignore
                    helperText={errors.name}
                    disabled={isSubmitting}
                    onChange={(evt) => setFieldValue("name", evt.target.value)}
                  />
                  <Box display="grid">
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="password" required>
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="current-password"
                        type={pass.show ? "text" : "password"}
                        value={values.password}
                        error={!!errors.password}
                        disabled={isSubmitting}
                        onChange={(evt) =>
                          setFieldValue("password", evt.target.value)
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {pass.show ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.password ? errors.password + "" : ""}
                      </FormHelperText>
                    </FormControl>
                    <Box display="flex" justifyContent="space-between">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Remember Password"
                        />
                      </FormGroup>
                      <Typography variant="subtitle2" marginTop=".5rem">
                        <Link href="forgot">
                          <MUILink href="forgot" underline="hover">
                            Forgot Password?
                          </MUILink>
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box display="grid" gap="8px" paddingX="1rem">
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    disableElevation
                    disabled={isSubmitting}
                    // onClick={() => setSubmitting(true)}
                  >
                    Login
                  </Button>
                  <Typography variant="body2" textAlign="center">
                    Don{"'"}t have an account?
                    <Link href="signup">
                      <MUILink href="signup" underline="hover">
                        Create Account
                      </MUILink>
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Form>
          )}
        </Formik>
        {/* <Formik>
          {() => (
            <Form>
              <TextField></TextField>
            </Form>
          )}
        </Formik> */}
      </Box>
      <Snackbar
        key={snack.id}
        anchorOrigin={{
          // @ts-ignore
          vertical: snack.vertical,
          // @ts-ignore
          horizontal: snack.horizontal,
        }}
        open={snack.open}
        autoHideDuration={snack.timeout}
        onClose={handleCloseSnack}
      >
        {snack.message}
      </Snackbar>
    </LayoutPage>
  );
}

export default PageSignin;

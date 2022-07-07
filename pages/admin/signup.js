import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Formik, Form, Field } from "formik";
import Link from "next/link";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MUILink from "@mui/material/Link";

// import Input from '@mui/material/Input';
// import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
// import FormHelperText from '@mui/material/FormHelperText';
import FormControl from "@mui/material/FormControl";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import LayoutPage from "@/layout/Page";

function PageSignup(props) {
  const theme = useTheme();
  const [values, setValues] = useState({
    username: "",
    role: "",
    password: "",
  });
  const [password, setPassword] = useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <LayoutPage>
      <Box
        display="grid"
        sx={{
          width: "100vw",
          minHeight: "100vh",
          placeContent: {
            mobile: "center stretch",
            tablet: "center",
          },
          background: {
            mobile: theme.palette.background.paper,
            tablet: theme.palette.background.default,
          },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            display: "grid",
            background: theme.palette.background.paper,
            width: {
              mobile: "100%",
              tablet: "460px",
            },
            padding: {
              mobile: "16px",
              tablet: "32px",
            },
            gap: {
              mobile: "24px",
              tablet: "44px",
            },
          }}
        >
          <Box component="form" display="grid" sx={{ placeItems: "center" }}>
            <Typography
              fontWeight={theme.typography.fontWeightBold}
              fontSize="1.8rem"
            >
              Create an Account
            </Typography>
            <Typography variant="subtitle1">
              Create a account to continue
            </Typography>
          </Box>
          <Box component="form" display="grid" gap="16px">
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              variant="outlined"
              helperText=""
            />
            <TextField
              id="username"
              label="Username"
              type="text"
              autoComplete="username"
              variant="outlined"
              helperText=""
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                label="Password"
                autoComplete="new-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography
                variant="subtitle2"
                textAlign="right"
                marginTop=".5rem"
              >
                <MUILink href="forgot" underline="hover">
                  Forgot Password?
                </MUILink>
                {/* <Link href="forgot">
                  <a>Forgot Password?</a>
                </Link> */}
              </Typography>
            </FormControl>
          </Box>
          <Box component="form" display="grid" gap="8px" paddingX="1rem">
            <Button
              variant="contained"
              type="submit"
              size="large"
              disableElevation
            >
              Create Account
            </Button>
            <Typography variant="body2" textAlign="center">
              Already have an account?{" "}
              <MUILink href="signin" underline="hover">
                Login
              </MUILink>
              {/* <Link href="signin">
                  <a>Login</a>
              </Link> */}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </LayoutPage>
  );
}

export default PageSignup;

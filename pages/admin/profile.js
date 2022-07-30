import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormikContext, Formik, Form, Field } from "formik";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import Avatar from "@mui/material/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
import { useUpdateByIdMutation } from "@/store/members";

const roles = [];

export default function Profile(props) {
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const [
    update,
    {
      data: data_update = {},
      error: error_update,
      isLoading: is_updating,
      isSuccess: is_updating_success,
      isError: is_updating_error,
    },
  ] = useUpdateByIdMutation();
  const [image, set_image] = useState({
    file: null,
    src: "",
  });
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Profile",
      active_link: "/admin/profile",
    });
  }, []);
  useEffect(() => {
    ctx_admin.set_loader(is_updating);
  }, [is_updating]);
  useEffect(() => {
    if (is_updating_success) {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Update Member.
          </Alert>
        ),
      }));
    } else if (is_updating_error) {
      // @ts-ignore
      if (errorCreating.status == 401) {
        ctx_auth.open_signin(true);
      }
      // @ts-ignore
      const message = errorCreating.error
        ? // @ts-ignore
          errorCreating.error
        : // @ts-ignore
          errorCreating.data.message;
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      }));
    }
  }, [is_updating_success, is_updating_error]);

  function handle_image(event) {
    set_image({
      file: event.target.files[0],
      src: URL.createObjectURL(event.target.files[0]),
    });
  }
  function handle_close_snack() {
    setSnack({
      id: 99,
      timeout: 5000,
      open: false,
      message: <div></div>,
      vertical: "bottom",
      horizontal: "center",
    });
  }
  function handle_validate() {}
  function handle_submit(values, { setSubmitting }) {
    const data = Object.assign({}, values);
    update({ data, image: image.file, token: user.token });
    setSubmitting(false);
  }

  return (
    <>
      <Box
        display="grid"
        padding={{
          xs: "16px",
          sm: "32px",
        }}
        gap={{
          xs: "16px",
          sm: "32px",
        }}
      >
        <Paper variant="outlined">
          <Box
            display="grid"
            padding={{
              xs: "8px",
              sm: "16px",
            }}
            gap={{
              xs: "8px",
              sm: "16px",
            }}
          >
            <Formik
              initialValues={Object.assign({}, user.account, { password: "" })}
              validate={handle_validate}
              onSubmit={handle_submit}
            >
              {({
                isSubmitting,
                values,
                errors,
                setFieldValue,
                handleSubmit,
              }) => (
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    padding={{
                      xs: "16px",
                      sm: "32px",
                    }}
                    gap={{
                      xs: "16px",
                      sm: "32px",
                    }}
                  >
                    <Box display="grid" sx={{ placeItems: "center" }}>
                      <Box
                        component="label"
                        htmlFor="input-image"
                        sx={{
                          width: {
                            xs: "50%",
                            sm: "25%",
                          },
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          id="input-image"
                          name="image"
                          type="file"
                          onChange={(e) => {
                            if (e.target.files.length) {
                              handle_image(e);
                              setFieldValue(
                                "image",
                                URL.createObjectURL(e.target.files[0])
                              );
                            }
                          }}
                          disabled={isSubmitting}
                        />
                        <Button
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          disabled={isSubmitting}
                          sx={{ width: "100%" }}
                        >
                          <Avatar
                            id="output-image"
                            variant="rounded"
                            // @ts-ignore
                            alt={values.name}
                            src={values.image}
                            sx={{
                              width: "100%",
                              height: "auto",
                              aspectRatio: "1",
                              objectFit: "contain",
                              objectPosition: "center",
                              opacity: isSubmitting ? ".7" : "1",
                            }}
                          >
                            <PhotoCameraIcon
                              sx={{ width: "44px", height: "44px" }}
                            />
                          </Avatar>
                        </Button>
                      </Box>
                      <FormHelperText error={!!errors.image}>
                        {errors.image ? errors.image + "" : ""}
                      </FormHelperText>
                    </Box>
                    <TextField
                      required
                      label="Username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={values.username}
                      error={!!errors.username}
                      // @ts-ignore
                      helperText={errors.username}
                      // disabled={isSubmitting}
                      // onChange={(evt) =>
                      //   setFieldValue("username", evt.target.value)
                      // }
                    ></TextField>
                    <TextField
                      required
                      label="Name"
                      name="name"
                      type="name"
                      autoComplete="name"
                      value={values.name}
                      error={!!errors.name}
                      // @ts-ignore
                      helperText={errors.name}
                      disabled={isSubmitting}
                      onChange={(evt) =>
                        setFieldValue("name", evt.target.value)
                      }
                    ></TextField>
                    <TextField
                      required
                      label="NIP"
                      name="nip"
                      type="text"
                      autoComplete="nip"
                      value={values.nip}
                      error={!!errors.nip}
                      // @ts-ignore
                      helperText={errors.nip}
                      disabled={isSubmitting}
                      onChange={(evt) => setFieldValue("nip", evt.target.value)}
                    ></TextField>
                    <TextField
                      required
                      aria-readonly
                      label="Role"
                      name="role"
                      value={values.role}
                      error={!!errors.role}
                      // @ts-ignore
                      helperText={errors.role}
                      disabled={isSubmitting}
                    ></TextField>
                    {/* <FormControl fullWidth>
                      <InputLabel id="role">Role</InputLabel>
                      <Select
                        required
                        labelId="role"
                        label="Role"
                        name="role"
                        value={values.role}
                        disabled={isSubmitting}
                        onChange={(evt) =>
                          setFieldValue("role", evt.target.value)
                        }
                      >
                        {roles.map((role) => (
                          <MenuItem
                            key={role.name}
                            value={role.name.toLowerCase()}
                          >
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="new-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        disabled={isSubmitting}
                        onChange={(evt) =>
                          setFieldValue("password", evt.target.value)
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              edge="end"
                              disabled={isSubmitting}
                              onClick={() =>
                                setFieldValue(
                                  "showPassword",
                                  !values.showPassword
                                )
                              }
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Box
                      display="grid"
                      paddingX={{
                        sm: "10%",
                        md: "30%",
                      }}
                    >
                      <Button
                        id="submit-btn"
                        variant="contained"
                        size="large"
                        disableElevation
                        disabled={isSubmitting}
                        type="submit"
                      >
                        Perbarui
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Paper>
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
        onClose={handle_close_snack}
      >
        {snack.message}
      </Snackbar>
    </>
  );
}

Profile.getLayout = AdminShell;

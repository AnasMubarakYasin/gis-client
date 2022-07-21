import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PausePresentation } from "@mui/icons-material";

/**
 * @callback onSubmit
 * @param {{name: string; password: string}} data
 */
/**
 * @callback onClose
 */
/**
 *
 * @param {{open: boolean; onSubmit: onSubmit; onClose: onClose; values: Object; errors: Object}} props
 * @returns
 */
export default function FormDialog(props) {
  const [open, setOpen] = useState(props.open);
  const [pass, setPass] = useState({
    amount: "",
    weight: "",
    weightRange: "",
    show: false,
  });
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);
  useEffect(() => {
    setValues(props.values);
  }, [props.values]);
  useEffect(() => {
    setErrors(props.errors);
  }, [props.errors]);

  const handleOpen = () => {
    // setOpen(true);
  };
  const handleClose = () => {
    // setOpen(false);
    props.onClose();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = props.onSubmit({ ...values });
    if (errors) {
      setErrors({ ...errors });
    }
  };
  const changeName = (event) => {
    setValues((prev) => {
      return { ...prev, name: event.target.value };
    });
  };
  const changePassword = (event) => {
    setValues((prev) => {
      return { ...prev, password: event.target.value };
    });
  };
  const handleClickShowPassword = () => {
    setPass({
      ...pass,
      show: !pass.show,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your Session is out, you need to login again.
          </DialogContentText>
          <Box
            component="form"
            id="dp"
            onSubmit={handleSubmit}
            paddingTop="16px"
            display="grid"
            gap="16px"
            autoComplete="off"
          >
            <TextField
              autoFocus
              required
              label="Username"
              name="name"
              type="text"
              // autoComplete="username"
              value={values.name}
              error={!!errors.name}
              helperText={errors.name}
              // disabled={isSubmitting}
              onChange={changeName}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="password" required error={!!errors.password}>
                Password
              </InputLabel>
              <OutlinedInput
                id="password"
                label="Password"
                name="password"
                // autoComplete="current-password"
                type={pass.show ? "text" : "password"}
                value={values.password}
                error={!!errors.password}
                // disabled={isSubmitting}
                onChange={changePassword}
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
              {!!errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="dp">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// import Authenticate from "@/layout/Authenticate";
// import Admin from "@/layout/Admin";
// import Page from "@/layout/Page";

import { useEffect, useState, useContext } from "react";
// @ts-ignore
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
// @ts-ignore
import { styled, useTheme } from "@mui/material/styles";
// @ts-ignore
import { Formik, Form, Field } from "formik";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";

import Card from "@mui/material/Card";
// @ts-ignore
import CardContent from "@mui/material/CardContent";
// @ts-ignore
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
// @ts-ignore
import DeleteIcon from "@mui/icons-material/Delete";
// @ts-ignore
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// @ts-ignore
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";

import {
  useGetAllQuery,
  useCreateMutation,
  useUpdateByIdMutation,
  useRemoveManyMutation,
  useUndoMutation,
} from "@/store/members";
import { useGetAllQuery as useGetAllQueryRoles } from "@/store/roles";

import { useForceUpdate } from "@/lib/helper-ui";

const role_id = {
  supervisor: "Pengawas",
  admin: "Admin",
  officer: "Petugas",
};

// @ts-ignore
export default function Members(props) {
  const forceUpdate = useForceUpdate();
  // @ts-ignore
  const router = useRouter();
  const theme = useTheme();
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const {
    data: members = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllQuery({ token: user.token });
  const { data: roles = [] } = useGetAllQueryRoles();
  const [
    create,
    {
      error: errorCreating,
      isLoading: isCreating,
      isSuccess: isCreatingSuccess,
      isError: isCreatingError,
    },
  ] = useCreateMutation();
  const [
    update,
    {
      data: dataUpdating = {},
      error: errorUpdating,
      isLoading: isUpdating,
      isSuccess: isUpdatingSuccess,
      isError: isUpdatingError,
    },
  ] = useUpdateByIdMutation();
  const [
    removeAll,
    {
      data: dataRemoving = [],
      error: errorRemoving,
      isLoading: isRemoving,
      isSuccess: isRemovingSuccess,
      isError: isRemovingError,
    },
  ] = useRemoveManyMutation();
  const [
    undo,
    {
      error: errorUndoing,
      isLoading: isUndoing,
      isSuccess: isUndoingSuccess,
      isError: isUndoingError,
    },
  ] = useUndoMutation();
  // const [showLoader, setShowLoader] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  // @ts-ignore
  const [searchMode, setSearchMode] = useState(false);
  const [removeList, setRemoveList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [buttonToggleGroup, setButtonToggleGroup] = useState([]);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [dialogValue, setDialogValue] = useState({
    id: undefined,
    image: "",
    username: "",
    name: "",
    nip: "",
    role: "",
    password: "",
    showPassword: false,
  });
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });
  const handleCreateOrUpdateMember = async (values, { setSubmitting }) => {
    delete values.showPassword;
    if (dialogValue.id) {
      update({
        data: values,
        image: imageFile,
        token: user.token,
      });
    } else {
      create({ data: values, image: imageFile, token: user.token });
    }
    setSubmitting(false);
  };
  const handleEnableRemoveMode = () => {
    setRemoveMode(true);
    setRemoveList([]);
  };
  const handleDisableRemoveMode = () => {
    setRemoveMode(false);
    setRemoveList([]);
    setButtonToggleGroup([]);
  };
  // @ts-ignore
  const handleRemoveSelection = (index) => (event) => {
    const copy = Array.of(...removeList);
    if (copy.includes(index)) {
      setRemoveList(copy.filter((item) => item != index));
    } else {
      copy.push(index);
      setRemoveList(copy);
    }
  };
  const handleRemoveDone = () => {
    handleOpenDialog();
    // handleDisableRemoveMode();
  };
  const handleRemoveCancel = () => {
    handleDisableRemoveMode();
  };
  // @ts-ignore
  const handleRemoveDialogconfirm = () => {};
  const handleRemoveMember = () => {
    const data = [];
    for (const index of removeList) {
      const member = members[index];
      data.push(member);
    }
    removeAll({ data, token: user.token });
  };
  const handleUpdateUndo = () => {
    undo({ list: [dataUpdating], token: user.token });
  };
  const handleRemoveUndo = () => {
    undo({ list: dataRemoving, token: user.token });
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialogAdd = () => {
    setOpenDialogAdd(true);
  };
  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };
  const handleDialogAddClose = () => {
    handleCloseDialogAdd();
    setButtonToggleGroup([]);
    setImage("");
    setImageFile(null);
    setDialogValue({
      id: undefined,
      image: "",
      username: "",
      nip: "",
      name: "",
      role: "",
      password: "",
      showPassword: false,
    });
  };
  // const handleOpenSnack = (message) => {
  //   setSnack({ open: true, message, vertical: "bottom", horizontal: "center" });
  // };
  const handleCloseSnack = () => {
    setSnack({
      id: 199,
      timeout: 5000,
      open: false,
      message: <div></div>,
      vertical: "bottom",
      horizontal: "center",
    });
  };
  // @ts-ignore
  const handleCardClick = (index) => (event) => {
    if (removeMode) {
      handleRemoveSelection(index)();
    } else {
      const member = members[index];
      if (member) {
        const copy = { ...member, showPassword: false };
        delete copy.password;
        setDialogValue(copy);
        handleOpenDialogAdd();
      }
    }
  };
  // @ts-ignore
  const handleButtonToggleGroup = (event, formats) => {
    setButtonToggleGroup(([prev]) => {
      const value = formats.pop();
      if (value == "Remove") {
        handleEnableRemoveMode();
      } else if (value == "Add") {
        handleOpenDialogAdd();
      }
      if (prev) {
        return [prev];
      } else {
        return [value];
      }
    });
  };

  useEffect(() => {
    forceUpdate();
    ctx_admin.set_loader(
      isFetching || isCreating || isUpdating || isRemoving || isUndoing
    );
  }, [isFetching, isCreating, isUpdating, isRemoving, isUndoing]);
  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Members",
      active_link: "/admin/members",
    });
  }, []);
  useEffect(() => {
    if (isSuccess) {
    }
    if (isError) {
      // @ts-ignore
      if (error.status == 401) {
        ctx_auth.open_signin(true);
      }
      // @ts-ignore
      const message = error.error ? error.error : error.data.message;
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
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isCreatingSuccess) {
      handleDialogAddClose();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Create Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isCreatingError) {
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
  }, [isCreatingSuccess, isCreatingError]);
  useEffect(() => {
    if (isUpdatingSuccess) {
      handleDialogAddClose();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert
            elevation={6}
            severity="success"
            action={
              <Button color="info" size="small" onClick={handleUpdateUndo}>
                Undo
              </Button>
            }
          >
            Success Update Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isUpdatingError) {
      // @ts-ignore
      if (errorUpdating.status == 401) {
        ctx_auth.open_signin(true);
      }
      // @ts-ignore
      const message = errorUpdating.error
        ? // @ts-ignore
          errorUpdating.error
        : // @ts-ignore
          errorUpdating.data.message;
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
  }, [isUpdatingSuccess, isUpdatingError]);
  useEffect(() => {
    if (isRemovingSuccess) {
      handleCloseDialog();
      handleDisableRemoveMode();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert
            elevation={6}
            severity="success"
            action={
              <Button color="info" size="small" onClick={handleRemoveUndo}>
                Undo
              </Button>
            }
          >
            Success Remove{" "}
            {
              // @ts-ignore
              dataRemoving.length
            }{" "}
            Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isRemovingError) {
      // @ts-ignore
      if (errorRemoving.status == 401) {
        ctx_auth.open_signin(true);
      }
      // @ts-ignore
      const message = errorRemoving.error
        ? // @ts-ignore
          errorRemoving.error
        : // @ts-ignore
          errorRemoving.data.message;

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
  }, [isRemovingSuccess, isRemovingError]);

  useEffect(() => {
    if (isUndoingSuccess) {
      let length = 1;
      // @ts-ignore
      if (dataRemoving.length) {
        // @ts-ignore
        length = dataRemoving.length;
      }
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Undo {length} Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isUndoingError) {
      // @ts-ignore
      if (errorUndoing.status == 401) {
        ctx_auth.open_signin(true);
      }
      // @ts-ignore
      const message = errorUndoing.error
        ? // @ts-ignore
          errorUndoing.error
        : // @ts-ignore
          errorUndoing.data.message;

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
  }, [isUndoingSuccess, isUndoingError]);

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
        <Box
          display="flex"
          gap={{
            xs: "16px",
            sm: "32px",
          }}
        >
          <Paper elevation={0}>
            <ToggleButtonGroup
              value={buttonToggleGroup}
              onChange={handleButtonToggleGroup}
              aria-label="Operation Controll"
            >
              <ToggleButton value="Add" aria-label="Add Member">
                <Tooltip title="Add Member">
                  <AddIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="Remove" aria-label="Remove Member">
                <Tooltip title="Remove Member">
                  <RemoveIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="Search" aria-label="Search">
                <Tooltip title="Search">
                  <SearchIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="more" aria-label="More Options">
                <Tooltip title="More Options">
                  <MoreVertIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
          {removeMode && (
            <Paper elevation={0}>
              <ToggleButtonGroup aria-label="Remove Operation Confirm">
                <ToggleButton
                  value="Done"
                  aria-label="Done Remove"
                  onClick={handleRemoveDone}
                >
                  <Tooltip title="Done Remove">
                    <DoneIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton
                  value="Clear"
                  aria-label="Clear Remove"
                  onClick={handleRemoveCancel}
                >
                  <Tooltip title="Clear Remove">
                    <ClearIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          )}
        </Box>
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}
          columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 8 }}
        >
          {[
            ...(isLoading || isFetching
              ? [
                  { id: 10, username: "a" },
                  { id: 20, username: "b" },
                  { id: 30, username: "c" },
                ]
              : members),
          ].map((member, index) => (
            <Grid
              item
              xs={1}
              sm={2}
              md={2}
              lg={2}
              xl={2}
              key={`${member.username}-${member.id}`}
            >
              <Card
                variant="outlined"
                sx={{ opacity: isFetching ? ".7" : "1s" }}
              >
                <CardActionArea
                  disabled={isFetching}
                  onClick={handleCardClick(index)}
                >
                  <Box
                    display="grid"
                    sx={{
                      position: "relative",
                      padding: {
                        xs: 2,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 8,
                      },
                      placeItems: "center",
                      gap: 2,
                    }}
                  >
                    {removeMode && (
                      <Checkbox
                        checked={removeList.includes(index)}
                        sx={{ position: "absolute", right: 0, top: 0 }}
                        // onChange={handleRemoveSelection(index)}
                      />
                    )}
                    {isLoading || isFetching ? (
                      <Skeleton animation="wave" variant="circular">
                        <Avatar
                          // alt={member.name}
                          // src={member.image}
                          sx={{ width: "86px", height: "86px" }}
                        ></Avatar>
                      </Skeleton>
                    ) : (
                      <Avatar
                        alt={member.username}
                        src={member.image}
                        sx={{ width: "86px", height: "86px" }}
                      ></Avatar>
                    )}
                    <Box display="grid" sx={{ placeItems: "center" }}>
                      {isLoading || isFetching ? (
                        <>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width="100%"
                          >
                            <Typography
                              variant="h6"
                              fontWeight={theme.typography.fontWeightMedium}
                            >
                              {".".repeat(10)}
                            </Typography>
                          </Skeleton>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width="100%"
                          >
                            <Typography variant="subtitle1">
                              {".".repeat(22)}
                            </Typography>
                          </Skeleton>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="h6"
                            fontWeight={theme.typography.fontWeightMedium}
                          >
                            {member.username}
                          </Typography>
                          <Typography variant="subtitle1">
                            {role_id[member.role]}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialogAdd}
        onClose={handleDialogAddClose}
      >
        <DialogTitle display="flex" alignItems="center">
          <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
            {dialogValue.id ? "Update" : "Create"} Member
          </Typography>
          <IconButton aria-label="close" onClick={handleDialogAddClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={dialogValue}
            onSubmit={handleCreateOrUpdateMember}
          >
            {({
              values,
              errors,
              isSubmitting,
              setFieldValue,
              handleSubmit,
            }) => (
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Box display="grid" gap={2}>
                  <Box display="grid" sx={{ placeItems: "center" }}>
                    <Button
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
                        type="file"
                        onChange={(e) => {
                          if (!e.target.files.length) return;
                          setImageFile(e.target.files[0]);
                          setFieldValue(
                            "image",
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                        disabled={isSubmitting}
                      />
                      <Avatar
                        id="output-image"
                        variant="rounded"
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
                      {/* </Button> */}
                    </Button>
                    {/* <FormHelperText error={!!errors.image}>
                      {errors.image ? errors.image + "" : ""}
                    </FormHelperText> */}
                  </Box>
                  <TextField
                    autoFocus
                    required
                    readOnly={!!dialogValue.id}
                    label="Username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={values.username}
                    error={!!errors.username}
                    // @ts-ignore
                    helperText={errors.username}
                    disabled={isSubmitting}
                    onChange={(evt) =>
                      !dialogValue.id &&
                      setFieldValue("username", evt.target.value)
                    }
                  ></TextField>
                  <TextField
                    required
                    label="Nama"
                    name="name"
                    type="name"
                    autoComplete="name"
                    value={values.name}
                    error={!!errors.name}
                    // @ts-ignore
                    helperText={errors.name}
                    disabled={isSubmitting}
                    onChange={(evt) => setFieldValue("name", evt.target.value)}
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
                  <FormControl fullWidth>
                    <InputLabel id="l-role">Role</InputLabel>
                    <Select
                      required
                      readOnly={!!dialogValue.id}
                      labelId="l-role"
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
                          {role_id[role.name.toLowerCase()]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      required={!dialogValue.id}
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
                  <Button
                    disableElevation
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {dialogValue.id ? "Update" : "Create"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleDialogAddClose}>Cancel</Button>
          <Button onClick={handleDialogAddClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are your sure want to Remove {removeList.length} Member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleRemoveMember}>Yes</Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}

Members.getLayout = AdminShell;

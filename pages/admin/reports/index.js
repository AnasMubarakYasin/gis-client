import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { Formik, Form, Field } from "formik";
import Link from "next/link";

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
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
// import {
//   useGetAllQuery,
//   useCreateMutation,
//   useUpdateByIdMutation,
//   useRemoveManyMutation,
//   useUndoMutation,
// } from "@/store/members";
import { useGetAllQuery } from "@/store/projects";
import { useForceUpdate } from "@/lib/helper-ui";

export default function Reports(props) {
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const theme = useTheme();
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);

  const {
    data: projects = [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
    // @ts-ignore
  } = useGetAllQuery({ token: user.token });

  const [removeMode, setRemoveMode] = useState(false);
  // @ts-ignore
  const [searchMode, setSearchMode] = useState(false);
  const [removeList, setRemoveList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [buttonToggleGroup, setButtonToggleGroup] = useState([]);
  const [dialogValue, setDialogValue] = useState({
    id: "dialog-report",
    image: "",
    username: "",
    email: "",
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
    delete values.id;
    delete values.showPassword;
    if (dialogValue.id) {
    } else {
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
  };
  const handleRemoveCancel = () => {
    handleDisableRemoveMode();
  };
  // @ts-ignore
  const handleRemoveDialogconfirm = () => {};
  const handleRemoveMember = () => {};
  const handleUpdateUndo = () => {};
  const handleRemoveUndo = () => {};
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
    setDialogValue({
      id: undefined,
      image: "",
      username: "",
      email: "",
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
  const handleCardClick = (index) => (event) => {};
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
    ctx_admin.set_ctx_data({
      title: "Reports",
      active_link: "/admin/reports",
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
      setSnack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {/* @ts-ignore */}
            {error.data.message}
          </Alert>
        ),
      });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Box
        display="grid"
        padding={{
          xs: 2,
          sm: 3,
        }}
        gap={{
          xs: 2,
          sm: 3,
        }}
      >
        {/* <Box
          display="flex"
          gap={{
            xs: 2,
            sm: 3,
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
        </Box> */}
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}
          columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 8 }}
        >
          {isLoading &&
            [10, 20, 30].map((value) => (
              <Grid
                item
                xs={1}
                sm={2}
                md={2}
                lg={2}
                xl={2}
                key={`${value}-project`}
              >
                <Card key={value} variant="outlined">
                  <CardActionArea disableTouchRipple={true}>
                    <Skeleton animation="wave" variant="rectangular">
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "4 / 3",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        image="/proto-512.v2.svg"
                        alt="Placeholder"
                      />
                    </Skeleton>
                    <CardContent>
                      <Skeleton animation="wave" variant="text" width="100%">
                        <Typography
                          variant="overline"
                          component="div"
                          sx={{
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          .
                        </Typography>
                      </Skeleton>
                      <Skeleton animation="wave" variant="text" width="100%">
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            height: "4rem",
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                          gutterBottom
                        >
                          .
                        </Typography>
                      </Skeleton>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          {projects.map((item, index) => (
            <Grid
              item
              xs={1}
              sm={2}
              md={2}
              lg={2}
              xl={2}
              key={`${item.id}-project`}
            >
              <Card
                variant="outlined"
                sx={{ position: "relative", opacity: isFetching ? ".7" : "1s" }}
              >
                <Link href={`/admin/reports/${item.id}`}>
                  <CardActionArea
                    disabled={isFetching}
                    onClick={handleCardClick(index)}
                    href={`/admin/reports/${item.id}`}
                  >
                    {removeMode && (
                      <Checkbox
                        checked={removeList.includes(index)}
                        sx={{ position: "absolute", right: 0, top: 0 }}
                        // onChange={handleRemoveSelection(index)}
                      />
                    )}
                    <CardMedia
                      component="img"
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "4 / 3",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography
                        variant="overline"
                        component="div"
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "1",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.name_company}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          height: "4rem",
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.name}
                      </Typography>
                      {/* <Box display="grid" gap="8px">
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                      ></LinearProgress>
                      <Typography variant="body2">
                        Progress: {item.progress}%
                      </Typography>
                      <Typography variant="body2">
                        Status: {item.status}
                      </Typography>
                    </Box> */}
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
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

Reports.getLayout = AdminShell;

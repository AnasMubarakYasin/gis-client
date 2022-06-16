import Admin from "@/layout/Admin";
import Page from "@/layout/Page";

import { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";

import { del, select, unselect, reselect } from "@/store/team";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";

export default function Team(props) {
  const router = useRouter();
  const [selectMode, setSelectMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    vertical: "bottom",
    horizontal: "right",
  });
  const theme = useTheme();
  const team = useSelector((state) => state.team.value);
  const selected = useSelector((state) => state.team.selected.length);
  const dispatch = useDispatch();
  const handleSelect = () => {
    dispatch(reselect());
    setSelectMode(!selectMode);
  };
  const handleAdd = () => {
    router.push("team/add");
  };
  const handleDialogDel = () => {
    selected ? handleOpenDialog() : handleOpenSnack("You not select anything");
  };
  const handleDel = () => {
    dispatch(del());
    handleCloseDialog();
  };
  const handleCancel = () => {
    dispatch(reselect());
    setSelectMode(false);
  };
  const handleDone = () => {
    dispatch(reselect());
    setSelectMode(false);
  };
  const handleSelection = (index) => (event) => {
    if (event.target.checked) {
      dispatch(select(index));
    } else {
      dispatch(unselect(index));
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenSnack = (message) => {
    setSnack({ open: true, message, vertical: "bottom", horizontal: "center" });
  };
  const handleCloseSnack = () => {
    setSnack({
      open: false,
      message: "",
      vertical: "bottom",
      horizontal: "center",
    });
  };

  return (
    <Page>
      <Admin pageTitle="Team">
        <Box
          display="grid"
          padding={{
            mobile: "16px",
            tablet: "32px",
          }}
          gap={{
            mobile: "16px",
            tablet: "32px",
          }}
        >
          <Box display="flex" flexWrap="wrap" gap="16px">
            <ButtonGroup
              variant="contained"
              disableElevation
              aria-label="outlined primary button group"
            >
              <Button
                variant="contained"
                component="button"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add
              </Button>
              <Button
                variant="contained"
                component="button"
                startIcon={<CheckIcon />}
                onClick={handleSelect}
              >
                Select
              </Button>
            </ButtonGroup>
            {selectMode && (
              <ButtonGroup
                variant="contained"
                disableElevation
                aria-label="outlined primary button group"
              >
                <Button
                  variant="contained"
                  component="button"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleDialogDel}
                >
                  Remove ( {selected} )
                </Button>
                <Button
                  variant="contained"
                  component="button"
                  startIcon={<ClearIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  component="button"
                  startIcon={<DoneIcon />}
                  onClick={handleDone}
                >
                  Done
                </Button>
              </ButtonGroup>
            )}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, 250px)"
            gridTemplateRows="repeat(auto-fill, 250px)"
            gap={{
              mobile: "16px",
              tablet: "32px",
            }}
          >
            {team.map((member, index) => (
              <Paper
                key={member.name}
                variant="outlined"
                sx={{
                  position: "relative",
                  padding: {
                    mobile: "16px",
                    tablet: "32px",
                  },
                }}
              >
                {selectMode && (
                  <Checkbox
                    sx={{ position: "absolute", right: 0, top: 0 }}
                    onChange={handleSelection(index)}
                  />
                )}
                <Box display="grid" sx={{ placeItems: "center", gap: "16px" }}>
                  <Avatar
                    alt={member.name}
                    src={member.image}
                    sx={{ width: "80px", height: "80px" }}
                  ></Avatar>
                  <Box display="grid" sx={{ placeItems: "center" }}>
                    <Typography
                      variant="h5"
                      fontWeight={theme.typography.fontWeightMedium}
                    >
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1">{member.job}</Typography>
                    <Typography variant="subtitle1">{member.email}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Delete Member</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are your sure want to delete {selected} member?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} autoFocus>
                Cancel
              </Button>
              <Button onClick={handleDel}>Yes</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Admin>
      <Snackbar
        sx={{
          width: {
            laptop: "40%",
            desktop: "35%",
          },
        }}
        key={snack.message}
        anchorOrigin={{
          vertical: snack.vertical,
          horizontal: snack.horizontal,
        }}
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        message={snack.message}
      />
    </Page>
  );
}
